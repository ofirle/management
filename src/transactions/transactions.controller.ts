import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { GetTransactionsTypeFilter } from './dto/get-transactions-type-filter.dto';
import {
  categoriesTitleMapping,
  transactionsTypeTitleMapping,
} from './category.mapping';
import * as XLSX from 'xlsx';
import { Type } from './dto/enums';
import { Source } from '../sources/sources.entity';
import { getManager } from 'typeorm';
import { BankType, SourceType } from '../sources/dto/enums';

const hashString = (string: string) => {
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
const parseExcelBankOtsarAhayal = async (filename, user) => {
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
    data.push({ ...row, hash: hashString(JSON.stringify(data)) });
    DataRowIndex += 1;
  }
  return data;
  //
  // const id = worksheet[`B${index}`].v;
  // //   const name = worksheet[`C${index}`].v;
  // //   console.log({ id, name });
  // // }
  // return Object.keys(excelData.Sheets).map((name) => ({
  //   name,
  //   data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
  // }));
};

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
  private logger = new Logger('TransactionController');

  constructor(private transactionsService: TransactionsService) {}

  @Get('/initData')
  getInitData(): any {
    this.logger.verbose(`getInitData`);
    return {
      type: 1,
      categoryMapping: categoriesTitleMapping,
      typeMapping: transactionsTypeTitleMapping,
    };
  }

  @Post('')
  @HttpCode(201)
  createTransaction(
    @Body() data: CreateTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    // this.logger.verbose(`User "${user.username}", create a new transaction.
    //    data: ${JSON.stringify(data)}`);
    return this.transactionsService.createTransaction(data, user);
  }

  @Post('create_many')
  @HttpCode(201)
  createTransactions(
    @Body() data: CreateTransactionDto[],
    @GetUser() user: User,
  ) {
    // this.logger.verbose(
    //   `User "${user.username}", create a new transaction.
    //    data: ${JSON.stringify(data)}`,
    // );
    try {
      return this.transactionsService.createTransaction(data[0], user);
    } catch (err) {
      return err.message;
    }
    // const response = data.map(async (transaction) => {
    //   try {
    //     return await this.transactionsService.createTransaction(
    //       transaction,
    //       user,
    //     );
    //   } catch (err) {
    //     if (err.code == 23505) {
    //       return `Duplicate row: ${JSON.stringify(transaction)}`;
    //     }
    //     return err.message;
    //   }
    // });
    //
    // console.log(response);
    // return response;
  }

  @Get('/read_file')
  async readFile(@GetUser() user: User): Promise<any> {
    const data = await parseExcelBankOtsarAhayal(
      'C:/Users/ofirl/Downloads/FibiSave1651621297096.xls',
      user,
    );

    // console.log(data);
    const promises = data.map(async (transaction) => {
      await this.transactionsService.createTransaction(transaction, user);
    });

    const r = Promise.all(promises).then((values) => {
      console.log(values);
    });
    console.log(r);

    // Promise.all(promises).then((results) =>
    //   results.forEach((result) => console.log(result)),
    // );

    return [];
    // return this.createTransactions(data, user);

    // console.log(data);
  }

  @Get('/:id')
  getTransaction(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<Transaction> {
    this.logger.verbose(
      `User "${user.username}", retrieving transaction by id ${id}`,
    );
    return this.transactionsService.getTransaction(id, user);
  }

  @Get()
  @HttpCode(200)
  async getTransactions(
    @Query() filterDto: GetTransactionsTypeFilter,
    @GetUser() user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", retrieving all transactions.
       filters: ${JSON.stringify(filterDto)}`,
    );
    const transactions = await this.transactionsService.getTransactions(
      filterDto,
      user,
    );

    return {
      type: 1,
      data: transactions,
    };
  }

  //
  // @Put('/:id')
  // @HttpCode(204)
  // updatePutTransaction(
  //   @Param('id') id: string,
  //   @Body() updatePutTransactionDto: CreateTransactionDto,
  //   @GetUser() user: User,
  // ): Promise<Transaction> {
  //   this.logger.verbose(
  //     `User "${user.username}", update put transaction.
  //      data: ${JSON.stringify(updatePutTransactionDto)}`,
  //   );
  //   return this.transactionsService.updatePutTransaction(
  //     id,
  //     updatePutTransactionDto,
  //     user,
  //   );
  // }
  //
  // @Patch('/:id')
  // @HttpCode(204)
  // updatePatchTransaction(
  //   @Param('id') id: string,
  //   @Body() updatePatchTransactionDto: UpdatePatchTransactionDto,
  //   @GetUser() user: User,
  // ): Promise<Transaction> {
  //   this.logger.verbose(
  //     `User "${user.username}", update patch transaction.
  //      data: ${JSON.stringify(updatePatchTransactionDto)}`,
  //   );
  //   return this.transactionsService.updatePatchTransaction(
  //     id,
  //     updatePatchTransactionDto,
  //     user,
  //   );
  // }
}
