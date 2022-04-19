import {
  Between,
  EntityRepository,
  In,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { User } from '../auth/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdatePatchTransactionDto } from './dto/update-patch-transaction.dto';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  // private logger = new Logger('ClientRepository');

  async getTransactions(filters, user: User): Promise<Transaction[]> {
    console.log(filters);
    const { dateStart, dateEnd, types, amountMin, amountMax, note, byUser } =
      filters;
    const findFilters = {};
    if (note) {
      findFilters['note'] = Like(`%${note}%`);
    }

    if (amountMin || amountMax)
      findFilters['amount'] = this.getQueryFilterRange(amountMin, amountMax);
    if (types) {
      findFilters['type'] = In(types);
    }

    if (dateStart || dateEnd)
      findFilters['date'] = this.getQueryFilterRange(dateStart, dateEnd);
    // if (dateRange) {
    //   dateRange = JSON.parse(dateRange);
    //   const { dateMin, dateMax } = dateRange;
    //   if (dateMin && dateMax) findFilters['amount'] = Between(dateMin, dateMax);
    //   else if (dateMin) findFilters['amount'] = MoreThanOrEqual(dateMin);
    //   else findFilters['amount'] = LessThanOrEqual(dateMax);
    // }
    return await this.find(findFilters);
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
    const transaction = this.create({
      ...data,
      paid,
      user,
    });
    try {
      await this.save(transaction);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
    return transaction;
  }

  async updatePutTransaction(
    id: string,
    data: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const paid = data.hasOwnProperty('paid') && data.paid === 'true';

    const transactionToUpdate = await this.findOne({
      where: { id },
    });
    console.log(transactionToUpdate);
    transactionToUpdate.date = data.date;
    transactionToUpdate.note = data.note;
    transactionToUpdate.amount = data.amount;
    transactionToUpdate.type = data.type;
    transactionToUpdate.category = data.category;
    transactionToUpdate.paid = paid;
    try {
      await this.save(transactionToUpdate);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
    return transactionToUpdate;
  }

  async updatePatchTransaction(
    id: string,
    data: UpdatePatchTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const transactionToUpdate = await this.findOne({
      where: { id },
    });
    let paid = transactionToUpdate.paid;
    if (data.hasOwnProperty('paid')) {
      paid = data.paid === 'true';
    }
    transactionToUpdate.date = data.date || transactionToUpdate.date;
    transactionToUpdate.note = data.note || transactionToUpdate.note;
    transactionToUpdate.amount = data.amount || transactionToUpdate.amount;
    transactionToUpdate.type = data.type || transactionToUpdate.type;
    transactionToUpdate.category =
      data.category || transactionToUpdate.category;
    transactionToUpdate.paid = paid;
    try {
      console.log(transactionToUpdate);
      await this.save(transactionToUpdate);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
    return transactionToUpdate;
  }
}
