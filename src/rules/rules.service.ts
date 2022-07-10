import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RulesRepository } from './rules.repository';
import { User } from '../auth/auth.entity';
import { Rule } from './rules.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { DeleteResult } from 'typeorm';
import { TransactionRepository } from '../transactions/transaction.repository';
import { GetTransactionsTypeFilter } from '../transactions/dto/get-transactions-type-filter.dto';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(RulesRepository)
    private ruleRepository: RulesRepository,
    private transactionRepository: TransactionRepository,
  ) {}

  async createRule(data: createRulesDto, user: User): Promise<Rule> {
    return this.ruleRepository.createRule(data, user);
  }

  // async runRules(user: User): Promise<Transaction[]> {
  //   return this.RuleRepository.runRules(user);
  // }

  async runRule(ruleId: number, user: User): Promise<any> {
    const rule = await this.getRule(ruleId, user);
    const filterDto = new GetTransactionsTypeFilter();
    filterDto.ruleId = null;

    // let ruleFilters = {};
    // const filterDto = new
    // if (filterDto.matchRuleId) {
    const ruleFilters = await this.ruleRepository.getRuleFilter(ruleId, user);
    // }
    const transactions = await this.transactionRepository.getTransactions(
      filterDto,
      ruleFilters,
      user,
    );

    const r = await this.ruleRepository.runRule(rule, transactions);
    console.log(r);
    return r;
  }

  async getRules(user: User): Promise<Rule[]> {
    return this.ruleRepository.getRules(user);
  }

  async getRule(id: number, user: User): Promise<Rule> {
    const rule = this.ruleRepository.findOne({ id, account: user.accountId });
    if (!rule) throw new NotFoundException(`rule id: ${id} not found`);
    return rule;
  }

  async deleteRule(id: number): Promise<DeleteResult> {
    return this.ruleRepository.delete(id);
  }
}
