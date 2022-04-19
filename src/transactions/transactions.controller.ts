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
import { UpdatePatchTransactionDto } from './dto/update-patch-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard())
export class TransactionsController {
  private logger = new Logger('SuppliersController');

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

  //
  // @Get('/:id')
  // getSupplier(
  //   @GetUser() user: User,
  //   @Param('id') id: string,
  // ): Promise<Transaction> {
  //   this.logger.verbose(
  //     `User "${user.username}", retrieving supplier by id ${id}`,
  //   );
  //   return this.transactionsService.getSupplier(id, user);
  // }
  //
  @Get()
  @HttpCode(200)
  getTransactions(
    @Query() filterDto: GetTransactionsTypeFilter,
    @GetUser() user: User,
  ): Promise<Transaction[]> {
    this.logger.verbose(
      `User "${user.username}", retrieving all supplier types.
       filters: ${JSON.stringify(filterDto)}`,
    );
    return this.transactionsService.getTransactions(filterDto, user);
  }

  //
  // @Get('/:id')
  // getSupplierType(
  //   @GetUser() user: User,
  //   @Param('id') id: string,
  // ): Promise<SupplierType> {
  //   this.logger.verbose(
  //     `User "${user.username}", retrieving supplier type.
  //      id: ${id}`,
  //   );
  //   return this.transactionsService.getSupplierType(id, user);
  // }
  //
  // @Post('/type')
  // @HttpCode(201)
  // createSupplierType(
  //   @Body() createSupplierTypeDto: CreateSupplierTypeDto,
  //   @GetUser() user: User,
  // ): Promise<SupplierType> {
  //   this.logger.verbose(
  //     `User "${user.username}", create a new supplier type.
  //      data: ${JSON.stringify(createSupplierTypeDto)}`,
  //   );
  //   return this.transactionsService.createSupplierType(
  //     createSupplierTypeDto,
  //     user,
  //   );
  // }
  //
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
