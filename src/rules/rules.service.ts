import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RulesRepository } from './rules.repository';
import { User } from '../auth/auth.entity';
import { Rule } from './rules.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(RulesRepository)
    private ruleRepository: RulesRepository,
  ) {}

  async createRule(data: createRulesDto, user: User): Promise<Rule> {
    return this.ruleRepository.createRule(data, user);
  }

  // async runRules(user: User): Promise<Transaction[]> {
  //   return this.RuleRepository.runRules(user);
  // }

  async runRule(ruleId: number, user: User): Promise<any> {
    const rule = await this.getRule(ruleId, user);
    return this.ruleRepository.runRule(rule);
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
