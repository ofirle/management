import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';
import { GetTransactionsTypeFilter } from './dto/get-transactions-type-filter.dto';
import {
  categoriesTitleMapping,
  transactionsTypeTitleMapping,
} from './category.mapping';
import { UpdatePatchTransactionDto } from './dto/update-patch-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
  private logger = new Logger('TransactionController');

  constructor(private transactionsService: TransactionsService) {}

  @Post('')
  @HttpCode(201)
  createTransaction(
    @Body() data: CreateTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    this.logger.verbose(
      `User "${user.username}", create a new transaction. 
       data: ${JSON.stringify(data)}`,
    );
    return this.transactionsService.createTransaction(data, user);
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
      categoryMapping: categoriesTitleMapping,
      typeMapping: transactionsTypeTitleMapping,
    };
  }

  @Put('/:id')
  @HttpCode(204)
  updatePutTransaction(
    @Param('id') id: string,
    @Body() updatePutTransactionDto: CreateTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    this.logger.verbose(
      `User "${user.username}", update put transaction.
       data: ${JSON.stringify(updatePutTransactionDto)}`,
    );
    return this.transactionsService.updatePutTransaction(
      id,
      updatePutTransactionDto,
      user,
    );
  }

  @Patch('/:id')
  @HttpCode(204)
  updatePatchTransaction(
    @Param('id') id: string,
    @Body() updatePatchTransactionDto: UpdatePatchTransactionDto,
    @GetUser() user: User,
  ): Promise<Transaction> {
    this.logger.verbose(
      `User "${user.username}", update patch transaction.
       data: ${JSON.stringify(updatePatchTransactionDto)}`,
    );
    return this.transactionsService.updatePatchTransaction(
      id,
      updatePatchTransactionDto,
      user,
    );
  }
}
