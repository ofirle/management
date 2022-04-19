import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { User } from '../auth/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { GetTransactionsTypeFilter } from './dto/get-transactions-type-filter.dto';
import { UpdatePatchTransactionDto } from './dto/update-patch-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository, // @InjectRepository(TransactionTypeRepository) // private transactionTypeRepository: TransactionTypeRepository,
  ) {}

  async createTransaction(
    data: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    return this.transactionRepository.createTransaction(data, user);
  }

  async getTransactions(
    filterDto: GetTransactionsTypeFilter,
    user: User,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions(filterDto, user);
  }

  //
  // async getSupplierType(id: string, user: User): Promise<SupplierType> {
  //   return this.transactionTypeRepository.getSupplierType(id, user);
  // }
  //
  // async createSupplierType(
  //   createSupplierTypeDto: CreateSupplierTypeDto,
  //   user: User,
  // ): Promise<SupplierType> {
  //   return this.transactionTypeRepository.createSupplierType(
  //     createSupplierTypeDto,
  //     user,
  //   );
  // }
  //
  async updatePutTransaction(
    id,
    updateTransactionData: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    return this.transactionRepository.updatePutTransaction(
      id,
      updateTransactionData,
      user,
    );
  }

  async updatePatchTransaction(
    id,
    updatePatchTransactionData: UpdatePatchTransactionDto,
    user: User,
  ): Promise<Transaction> {
    return this.transactionRepository.updatePatchTransaction(
      id,
      updatePatchTransactionData,
      user,
    );
  }
}
