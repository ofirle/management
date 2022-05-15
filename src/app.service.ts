import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users/users.repository';
import { TransactionRepository } from './transactions/transaction.repository';
import { CategoriesRepository } from './categories/categories.repository';
import { RulesRepository } from './rules/rules.repository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    @InjectRepository(CategoriesRepository)
    private categoryRepository: CategoriesRepository,
    @InjectRepository(RulesRepository)
    private ruleRepository: RulesRepository,
  ) {}
}
