import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RulesRepository } from './rules.repository';
import { User } from '../auth/auth.entity';
import { Rule } from './rules.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(RulesRepository)
    private RuleRepository: RulesRepository,
  ) {}

  async createRule(data: createRulesDto, user: User): Promise<Rule> {
    return this.RuleRepository.createRule(data, user);
  }

  async runRules(user: User): Promise<Transaction[]> {
    return this.RuleRepository.runRules(user);
  }

  async getRules(user: User): Promise<Rule[]> {
    return this.RuleRepository.getRules(user);
  }
}
