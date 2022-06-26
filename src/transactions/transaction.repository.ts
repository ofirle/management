import {
  Between,
  EntityRepository,
  Equal,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../auth/auth.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsTypeFilter } from './dto/get-transactions-type-filter.dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { displayUserData } from '../shared/displayEntity';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  private logger = new Logger('TransactionController');

  async getTransactions(
    filters: GetTransactionsTypeFilter,
    user: User,
  ): Promise<Transaction[]> {
    console.log(filters);
    const {
      archived,
      dateStart,
      dateEnd,
      types,
      amountMin,
      amountMax,
      note,
      categories,
      description,
      title,
      usersId,
    } = filters;
    const findFilters = {};
    findFilters['account'] = Equal(user.accountId);
    findFilters['isArchived'] = false;
    if (archived && archived.includes('yes') && archived.length === 1) {
      findFilters['isArchived'] = true;
    }
    if (usersId) {
      findFilters['user'] = In(usersId);
    }
    if (description) {
      findFilters['description'] = Like(`%${description}%`);
    }
    if (note) {
      findFilters['note'] = Like(`%${note}%`);
    }

    if (title) {
      findFilters['title'] = Like(`%${title}%`);
      findFilters['description'] = Like(`%${title}%`);
    }

    if (amountMin || amountMax)
      findFilters['amount'] = this.getQueryFilterRange(amountMin, amountMax);
    if (types) {
      findFilters['type'] = In(types);
    }
    if (categories) {
      findFilters['category'] = In(categories);
    }

    if (dateStart || dateEnd)
      findFilters['date'] = this.getQueryFilterRange(dateStart, dateEnd);
    return await this.find(findFilters);
  }

  async getTransaction(id, user: User): Promise<Transaction> {
    const transaction = await this.findOne({ id, user });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  getQueryFilterRange(dataMin, dataMax) {
    if (dataMin && dataMax) return Between(dataMin, dataMax);
    else if (dataMin) return MoreThanOrEqual(dataMin);
    else if (dataMax) return LessThanOrEqual(dataMax);
    else return null;
  }

  async createTransaction(
    data: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const paid = data.hasOwnProperty('paid') && data.paid === 'true';
    const title = data.title ? data.title : data.description;
    const transaction = this.create({
      ...data,
      title,
      paid,
      user,
      account: user.accountId,
    });
    try {
      await this.save(transaction);
    } catch (err) {
      if (err.code === '23505') {
        this.logger.error(`Duplicate Row: ${JSON.stringify(transaction)}`);
        return transaction;
      }
      this.logger.error(`Error: ${JSON.stringify(err)}`);
      this.logger.error(`Transaction: ${JSON.stringify(transaction)}`);

      throw err;
    }
    transaction.user = displayUserData(transaction.user);
    return transaction;
  }

  // async updatePutTransaction(
  //   id: string,
  //   data: CreateTransactionDto,
  //   user: User,
  // ): Promise<Transaction> {
  //   const paid = data.hasOwnProperty('paid') && data.paid === 'true';
  //
  //   const transactionToUpdate = await this.findOne({
  //     where: { id },
  //   });
  //   console.log(transactionToUpdate);
  //   transactionToUpdate.date = data.date;
  //   transactionToUpdate.note = data.note;
  //   transactionToUpdate.amount = data.amount;
  //   transactionToUpdate.type = data.type;
  //   transactionToUpdate.category = data.category;
  //   transactionToUpdate.paid = paid;
  //   try {
  //     await this.save(transactionToUpdate);
  //   } catch (err) {
  //     console.log(err.stack);
  //     throw err;
  //   }
  //   return transactionToUpdate;
  // }
  //
  // async updatePatchTransaction(
  //   id: string,
  //   data: UpdatePatchTransactionDto,
  //   user: User,
  // ): Promise<Transaction> {
  //   const transactionToUpdate = await this.findOne({
  //     where: { id },
  //   });
  //   let paid = transactionToUpdate.paid;
  //   if (data.hasOwnProperty('paid')) {
  //     paid = data.paid === 'true';
  //   }
  //   transactionToUpdate.date = data.date || transactionToUpdate.date;
  //   transactionToUpdate.note = data.note || transactionToUpdate.note;
  //   transactionToUpdate.amount = data.amount || transactionToUpdate.amount;
  //   transactionToUpdate.type = data.type || transactionToUpdate.type;
  //   transactionToUpdate.category =
  //     data.category || transactionToUpdate.category;
  //   transactionToUpdate.paid = paid;
  //   try {
  //     console.log(transactionToUpdate);
  //     await this.save(transactionToUpdate);
  //   } catch (err) {
  //     console.log(err.stack);
  //     throw err;
  //   }
  //   return transactionToUpdate;
  // }
}
