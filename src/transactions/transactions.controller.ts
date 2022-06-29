import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/auth.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { transactionsTypeTitleMapping } from './category.mapping';
import { LoadFileDto } from './dto/load-filte.dto';
import { CategoriesService } from '../categories/categories.service';
import { ActionsEnum } from '../shared/enum';
import { GetTransactionsTypeFilter } from './dto/get-transactions-type-filter.dto';
import { AuthRepository } from '../auth/auth.repository';
import { RulesService } from '../rules/rules.service';

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
  private logger = new Logger('TransactionController');

  constructor(
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private rulesService: RulesService,
    private authRepository: AuthRepository,
  ) {}

  @Get('/initData')
  async getInitData(
    @GetUser({ actions: ActionsEnum.ReadTransactions }) user: User,
  ): Promise<any> {
    this.logger.verbose(`getInitData`);
    const users = await this.authRepository.find({ account: user.accountId });
    const usersData = users.map((userLocal) => {
      return {
        id: userLocal.id,
        name: userLocal.id === user.id ? 'Me' : userLocal.name,
      };
    });
    try {
      const categories = await this.categoriesService.getCategories(user);
      const rules = await this.rulesService.getRules(user);
      return {
        data: {
          categories: categories,
          rules: rules,
          users: usersData,
          typeMapping: transactionsTypeTitleMapping,
        },
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('')
  @HttpCode(201)
  async createTransaction(
    @GetUser({ actions: ActionsEnum.CreateTransaction }) user: User,
    @Body() data: CreateTransactionDto,
  ): Promise<any> {
    this.logger.verbose(`User "${user.username}", create a new transaction.
       data: ${JSON.stringify(data)}`);
    try {
      const transaction = await this.transactionsService.createTransaction(
        data,
        user,
      );
      return {
        data: transaction,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('create_many')
  @HttpCode(201)
  async createTransactions(
    @Body() data: CreateTransactionDto[],
    @GetUser({ actions: ActionsEnum.CreateTransaction }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", create a new transaction.
       data: ${JSON.stringify(data)}`,
    );
    try {
      const transactions = await this.transactionsService.createTransaction(
        data[0],
        user,
      );
      return {
        data: transactions,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/read_file')
  async importTransactions(
    @GetUser({ actions: ActionsEnum.ImportTransactions }) user: User,
    @Body() data: LoadFileDto,
  ): Promise<any> {
    try {
      const transactions =
        await this.transactionsService.insertTransactionsFromExcel(
          data.source,
          data.file_name,
          user,
        );
      return {
        data: transactions,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async getTransaction(
    @GetUser({ actions: ActionsEnum.ReadTransaction }) user: User,
    @Param('id') id: string,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", retrieving transaction by id ${id}`,
    );
    try {
      const transaction = await this.transactionsService.getTransaction(
        id,
        user,
      );
      return {
        data: transaction,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Get('/rules/:id')
  // async getTransactionByRule(
  //   @GetUser({ actions: ActionsEnum.ReadTransaction }) user: User,
  //   @Param('id') ruleId: number,
  // ): Promise<any> {
  //   this.logger.verbose(
  //     `User "${user.username}", retrieving transaction by rule id ${ruleId}`,
  //   );
  //   try {
  //     const transaction = await this.transactionsService.getTransactionByRule(
  //       ruleId,
  //       user,
  //     );
  //     return {
  //       data: transaction,
  //     };
  //   } catch (err) {
  //     this.logger.error(err);
  //     if (err instanceof HttpException) throw err;
  //     return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @Get()
  @HttpCode(200)
  async getTransactions(
    @Query() filterDto: GetTransactionsTypeFilter,
    @GetUser({ actions: ActionsEnum.ReadTransactions }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", retrieving all transactions.
       filters: ${JSON.stringify(filterDto)}`,
    );
    try {
      const transactions = await this.transactionsService.getTransactions(
        filterDto,
        user,
      );
      return {
        data: transactions,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  async deleteTransaction(
    @GetUser({ actions: ActionsEnum.ReadTransaction }) user: User,
    @Param('id') id: string,
  ): Promise<any> {
    this.logger.verbose(`User "${user.username}", delete transaction`);
    try {
      let transaction = await this.transactionsService.getTransaction(id, user);

      transaction = await this.transactionsService.archiveTransaction(
        transaction,
      );

      return {
        type: 1,
        data: transaction,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
