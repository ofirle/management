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
import { BankType, CreditCardType, SourceType } from '../sources/dto/enums';
import { Type } from './dto/enums';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository, // @InjectRepository(TransactionTypeRepository) // private transactionTypeRepository: TransactionTypeRepository,
  ) {}

  createTransaction(
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

  insertTransactionsFromExcel = async (source, filename, userId) => {
    let data = [];
    switch (source) {
      case BankType.OTSAR_AHAYAL:
        data = await this.parseOtsarAhayal(filename);
        break;
      case CreditCardType.ISRACARD:
        data = await this.parseIsracard(filename);
        break;
    }
    console.log(data);
    return await Promise.all(
      data.map((transaction) => {
        return this.createTransaction(transaction, userId);
      }),
    );
  };

  parseOtsarAhayal = async (filename) => {
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
      const extraData = {
        certificationNumber: worksheet[`E${DataRowIndex}`].v,
        actionKey: worksheet[`C${DataRowIndex}`].v,
      };

      const row = {
        date,
        extraData,
        description: worksheet[`D${DataRowIndex}`].v,
        amount,
        type:
          worksheet[`F${DataRowIndex}`].v === ' ' ? Type.EXPENSE : Type.INCOME,
        category: null,
        note: null,
        source: source.id,
      };
      data.push({ ...row, hash: this.hashString(JSON.stringify(data)) });
      DataRowIndex += 1;
    }
    return data;
  };
  getDataSingleCreditCardIsracardIntentional = (
    worksheet,
    indexIntentional,
    sourceId,
  ) => {
    const dataIntentional = [];
    indexIntentional += 3;
    console.log(indexIntentional);
    while (
      `F${indexIntentional}` in worksheet &&
      worksheet[`F${indexIntentional}`].v !== ''
    ) {
      const [day, month, year] =
        worksheet[`A${indexIntentional}`].w.split(/\//);
      const date = `${month}-${day}-${year}`;

      let amount = Math.abs(worksheet[`F${indexIntentional}`].v);
      if (worksheet[`G${indexIntentional}`].v === '€') {
        amount *= 3.8;
      } else if (worksheet[`G${indexIntentional}`].v === '$') {
        amount *= 3.5;
      }
      const extraData = null;
      const row = {
        date,
        description: worksheet[`C${indexIntentional}`].v,
        extraData,
        amount,
        type: Type.EXPENSE,
        category: null,
        note: null,
        source: sourceId,
      };
      dataIntentional.push({
        ...row,
        hash: this.hashString(JSON.stringify(row)),
      });
      indexIntentional += 1;
      console.log(indexIntentional);
    }
    return { dataIntentional, indexIntentional };
  };

  getDataSingleCreditCardIsracardLocal = (worksheet, indexLocal, sourceId) => {
    const dataLocal = [];
    while (
      `G${indexLocal}` in worksheet &&
      worksheet[`G${indexLocal}`].v !== ''
    ) {
      let [day, month, year] = worksheet[`A${indexLocal}`].w.split(/\//);
      let paymentNumber = null;
      if (
        `H${indexLocal}` in worksheet &&
        !['', 'זיכוי'].includes(worksheet[`H${indexLocal}`].v)
      ) {
        paymentNumber = parseInt(
          worksheet[`H${indexLocal}`].v
            .split('תשלום')[1]
            .split('מתוך')[0]
            .trim(),
        );
        paymentNumber -= 1;
        month = parseInt(month);
        if (month + paymentNumber > 12) {
          year = parseInt(year) + 1;
        }
        month = (month + paymentNumber) % 13;
      }
      const date = `${month}-${day}-${year}`;

      const amount = Math.abs(worksheet[`E${indexLocal}`].v);
      const extraData = {
        certificationNumber: worksheet[`G${indexLocal}`].v,
      };
      const row = {
        date,
        description: worksheet[`B${indexLocal}`].v,
        amount,
        type: worksheet[`E${indexLocal}`].v < 0 ? Type.INCOME : Type.EXPENSE,
        category: null,
        note: null,
        extraData,
        source: sourceId,
      };
      dataLocal.push({
        ...row,
        hash: this.hashString(JSON.stringify(row)),
      });
      indexLocal += 1;
    }

    return { dataLocal, indexLocal };
  };

  getDataSingleCreditCardIsracard = (sourceId, worksheet, index) => {
    const data = [];
    if (
      !(`A${index}` in worksheet) ||
      worksheet[`A${index}`].v === '' ||
      !(`A${index + 1}` in worksheet) ||
      worksheet[`A${index}`].v.includes('אין נתונים להצגה')
    ) {
      return { data, index: index + 3 };
    }
    index += 3;
    const { dataLocal, indexLocal } = this.getDataSingleCreditCardIsracardLocal(
      worksheet,
      index,
      sourceId,
    );
    index = indexLocal;
    data.push(...dataLocal);

    const { dataIntentional, indexIntentional } =
      this.getDataSingleCreditCardIsracardIntentional(
        worksheet,
        index,
        sourceId,
      );
    index = indexIntentional;
    data.push(...dataIntentional);
    return { data, index: index + 2 };
  };

  parseIsracard = async (filename) => {
    const excelData = XLSX.readFile(filename);
    const worksheet = excelData.Sheets[excelData.SheetNames[0]];

    let DataRowIndex = 4;
    const totalData = [];
    const source = await getManager().findOne(Source, {
      type: SourceType.CREDIT_CARD,
      typeKey: CreditCardType.ISRACARD,
    });
    console.log(worksheet);
    //not include international actions

    while (
      `A${DataRowIndex}` in worksheet &&
      worksheet[`A${DataRowIndex}`].v !== ''
    ) {
      const { data, index } = this.getDataSingleCreditCardIsracard(
        source.id,
        worksheet,
        DataRowIndex,
      );
      totalData.push(...data);
      DataRowIndex = index;
    }
    return totalData;
  };
}
