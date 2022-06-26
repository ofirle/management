import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './transactions/transaction.repository';
import { CategoriesRepository } from './categories/categories.repository';
import { RulesRepository } from './rules/rules.repository';
import { AuthRepository } from './auth/auth.repository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    // @InjectRepository(UsersRepository)
    // private usersRepository: UsersRepository,
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @InjectRepository(CategoriesRepository)
    private categoryRepository: CategoriesRepository,
    @InjectRepository(RulesRepository)
    private ruleRepository: RulesRepository,
  ) {}
}
