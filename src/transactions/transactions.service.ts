import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { User } from '../users/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { GetTransactionsTypeFilter } from './dto/get-transactions-type-filter.dto';
import * as XLSX from 'xlsx';
import { getManager } from 'typeorm';
import { Source } from '../sources/sources.entity';
import { BankType, SourceType } from '../sources/dto/enums';
import { Type } from './dto/enums';

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
    try {
      return this.transactionRepository.createTransaction(data, user);
    } catch (err) {
      throw err;
    }
  }

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
  // async updatePutTransaction(
  //   id,
  //   updateTransactionData: CreateTransactionDto,
  //   user: User,
  // ): Promise<Transaction> {
  //   return this.transactionRepository.updatePutTransaction(
  //     id,
  //     updateTransactionData,
  //     user,
  //   );
  // }

  // async updatePatchTransaction(
  //   id,
  //   updatePatchTransactionData: UpdatePatchTransactionDto,
  //   user: User,
  // ): Promise<Transaction> {
  //   return this.transactionRepository.updatePatchTransaction(
  //     id,
  //     updatePatchTransactionData,
  //     user,
  //   );
  // }

  async getTransactions(
    filterDto: GetTransactionsTypeFilter,
    user: User,
  ): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions(filterDto, user);
  }

  async getTransaction(id: string, user: User): Promise<Transaction> {
    return this.transactionRepository.getTransaction(id, user);
  }

  hashString = (string: string) => {
    let hash = 0,
      i,
      chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
      chr = string.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  insertTransactionsFromExcel = async (source, filename, user) => {
    let data = [];
    switch (source) {
      case BankType.OTSAR_AHAYAL:
        data = await this.parseOtsarAhayal(filename, user);
        break;
    }

    return await Promise.all(
      data.map((transaction) => {
        return this.createTransaction(transaction, user);
      }),
    );
  };

  parseOtsarAhayal = async (filename, user) => {
    const excelData = XLSX.readFile(filename);
    const worksheet = excelData.Sheets[excelData.SheetNames[0]];

    let DataRowIndex = 3;
    const data = [];
    const source = await getManager().findOne(Source, {
      type: SourceType.BANK,
      typeKey: BankType.OTSAR_AHAYAL,
    });
    while (worksheet[`B${DataRowIndex}`]) {
      const amount =
        worksheet[`F${DataRowIndex}`].v === ' '
          ? worksheet[`G${DataRowIndex}`].v
          : worksheet[`F${DataRowIndex}`].v;
      const initial = worksheet[`B${DataRowIndex}`].w.split(/\//);
      const date = `${initial[1]}-${initial[0]}-${initial[2]}`;
      const row = {
        date,
        actionKey: worksheet[`C${DataRowIndex}`].v,
        description: worksheet[`D${DataRowIndex}`].v,
        certificationNumber: worksheet[`E${DataRowIndex}`].v,
        amount,
        type:
          worksheet[`F${DataRowIndex}`].v === ' ' ? Type.EXPENSE : Type.INCOME,
        category: null,
        note: null,
        source,
        user,
      };
      data.push({ ...row, hash: this.hashString(JSON.stringify(data)) });
      DataRowIndex += 1;
    }
    return data;
  };
}
