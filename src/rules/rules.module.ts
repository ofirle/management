import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RulesRepository } from './rules.repository';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { AuthModule } from '../auth/auth.module';
import { TransactionRepository } from '../transactions/transaction.repository';
import { TransactionsService } from '../transactions/transactions.service';
import { CategoriesRepository } from '../categories/categories.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RulesRepository,
      TransactionRepository,
      CategoriesRepository,
    ]),
    AuthModule,
  ],
  controllers: [RulesController],
  providers: [RulesService, TransactionsService],
})
export class RulesModule {}
