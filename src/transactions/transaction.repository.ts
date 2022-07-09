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
    filterParams: GetTransactionsTypeFilter,
    ruleFilters: any,
    user: User,
  ): Promise<Transaction[]> {
    console.log(filterParams);
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
      ruleId,
    } = filterParams;
    const findFilters = { ...ruleFilters };
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

    if (amountMin || amountMax) {
      findFilters['amount'] = this.getQueryFilterRange(amountMin, amountMax);
    }
    if (types) {
      findFilters['type'] = In(types);
    }
    if (categories) {
      findFilters['category'] = In(categories);
    }
    if (ruleId) {
      findFilters['rule'] = Equal(ruleId);
    }
    if (dateStart || dateEnd) {
      findFilters['date'] = this.getQueryFilterRange(dateStart, dateEnd);
    }
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

  // async getTransactionByRule(
  //   ruleId: number,
  //   user: User,
  // ): Promise<Transaction[]> {
  //   const rule = await getManager()
  //     .getRepository(Rule)
  //     .findOne({ id: ruleId, account: user.accountId });
  //
  //   if (!rule) {
  //     throw new NotFoundException('Rule not found');
  //   }
  //   const filters = [];
  //   console.log(rule.conditions);
  //   rule.conditions.title.forEach((condition) => {
  //     const value = condition.value.toLowerCase();
  //     switch (condition.comparisonFunction) {
  //       case StringComparisonFunctions.CONTAINS:
  //         filters['description'] = Like(`%${value}%`);
  //         break;
  //       case StringComparisonFunctions.EQUAL:
  //         filters['description'] = Like(`${value}`);
  //         break;
  //       case StringComparisonFunctions.START_WITH:
  //         filters['description'] = Like(`%${value}`);
  //         break;
  //       case StringComparisonFunctions.END_WITH:
  //         filters['description'] = Like(`${value}%`);
  //         break;
  //       default:
  //         throw new Error(
  //           `method ${condition.comparisonFunction} not supported yet`,
  //         );
  //     }
  //   });
  //   if (rule.type) {
  //     filters['type'] = rule.type;
  //   }
  //
  //   const transactions = await this.find({
  //     user,
  //     ...filters,
  //   });
  //   console.log(rule);
  //   console.log(filters);
  //   console.log(transactions);
  //
  //   return transactions;
  // }
}
