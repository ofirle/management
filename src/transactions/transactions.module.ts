import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRepository } from './transaction.repository';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AuthModule } from '../auth/auth.module';
import { CategoriesService } from '../categories/categories.service';
import { CategoriesRepository } from '../categories/categories.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionRepository,
      CategoriesRepository,
      UsersRepository,
    ]),
    AuthModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, CategoriesService],
})
export class TransactionsModule {}
