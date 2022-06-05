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
import { transactionsTypeTitleMapping } from './category.mapping';
import { LoadFileDto } from './dto/load-filte.dto';
import { CategoriesService } from '../categories/categories.service';
import { UsersRepository } from '../users/users.repository';

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
  private logger = new Logger('TransactionController');

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private userRepository: UsersRepository,
  ) {}

  @Get('/initData')
  async getInitData(@GetUser() user: User): Promise<any> {
    this.logger.verbose(`getInitData`);
    const users = await this.userRepository.find({ account: user.accountId });
    const usersData = users.map((userLocal) => {
      const userData = {
        id: userLocal.id,
        name: userLocal.name,
      };
      if (userLocal.id === user.id) {
        userData.name = 'Me';
      }

      return userData;
    });
    return {
      type: 1,
      categories: await this.categoriesService.getCategories(user),
      users: usersData,
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

  @Post('/read_file')
  async readFile(
    @GetUser() user: User,
    @Body() data: LoadFileDto,
  ): Promise<any> {
    return await this.transactionsService.insertTransactionsFromExcel(
      data.source,
      data.file_name,
      user,
    );
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
