import { EntityRepository, getManager, Like, Repository } from 'typeorm';
import { Rule } from './rules.entity';
import { User } from '../auth/auth.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { Transaction } from '../transactions/transaction.entity';
import { StringComparisonFunctions } from './dto/enum';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(Rule)
export class RulesRepository extends Repository<Rule> {
  async createRule(data: createRulesDto, user: User): Promise<Rule> {
    const rule = new Rule();
    if (!data.titleConditions && !data.priceConditions) {
      throw new BadRequestException('no condition has been set');
    }
    const conditions = {
      title: data.titleConditions || [],
      price: data.priceConditions || [],
    };
    rule.account = user.account;
    rule.title = data.title;
    rule.conditions = conditions;
    if (data.sourceIds) {
      rule.sources = data.sourceIds;
      // rule.sources = await getManager().findByIds(Source, data.sourceIds);
    }
    rule.transactionType = data.transactionType ?? null;
    rule.user = user.id;
    const { categoryId, isArchived, title } = data.setData;
    if (categoryId) {
      rule.category = categoryId;
      // rule.category = await getManager().findOne(Category, categoryId);
    }
    rule.setTitle = title;
    rule.isArchived = isArchived;
    //   data.titleConditions.forEach((condition) => {
    //     const value = condition.value.toLowerCase();
    //     let queryCondition = '';
    //     switch (condition.comparisonFunction) {
    //       case StringComparisonFunctions.CONTAINS:
    //         queryCondition = `LIKE '%${value}%'`;
    //         break;
    //       case StringComparisonFunctions.EQUAL:
    //         queryCondition = `LIKE '${value}'`;
    //         break;
    //       default:
    //         throw new Error('method not supported yet');
    //     }
    //     conditions.title.push(queryCondition);
    //   });
    // }
    // if (data.priceConditions) {
    //   data.priceConditions.forEach((condition) => {
    //     let queryCondition = '';
    //     switch (condition.comparisonFunction) {
    //       case NumberComparisonFunctions.EQUAL:
    //         queryCondition = `= ${condition.value}`;
    //         break;
    //       case NumberComparisonFunctions.GREATER_EQUAL_THEN:
    //         queryCondition = `>= ${condition.value}`;
    //         break;
    //       case NumberComparisonFunctions.LESS_EQUAL_THEN:
    //         queryCondition = `<= ${condition.value}`;
    //         break;
    //       default:
    //         throw new Error('method not supported yet');
    //     }
    //     conditions.title.push(queryCondition);
    //   });
    // }
    // rule.return; // if (data.titleConditions) {
    await this.save(rule);
    return rule;
  }

  async getRules(user: User): Promise<Rule[]> {
    console.log(user);
    console.log(user.account);
    const rules = await this.find({ account: user.accountId });
    return rules;
  }

  async runRules(user: User): Promise<Transaction[]> {
    const rules = await this.find({ account: user.accountId });
    const updatedTransactions = [];
    for (const rule of rules) {
      const filters = [];
      rule.conditions.title.forEach((condition) => {
        const value = condition.value.toLowerCase();
        switch (condition.comparisonFunction) {
          case StringComparisonFunctions.CONTAINS:
            filters['description'] = Like(`%${value}%`);
            break;
          case StringComparisonFunctions.EQUAL:
            filters['description'] = Like(`${value}`);
            break;
          case StringComparisonFunctions.START_WITH:
            filters['description'] = Like(`%${value}`);
            break;
          case StringComparisonFunctions.END_WITH:
            filters['description'] = Like(`${value}%`);
            break;
          default:
            throw new Error(
              `method ${condition.comparisonFunction} not supported yet`,
            );
        }
      });
      if (rule.transactionType) {
        filters['type'] = rule.transactionType;
      }

      let transactions = await getManager().find(Transaction, {
        user,
        ...filters,
      });
      console.log(rule);
      transactions = transactions.map((transaction) => {
        if (rule.category) {
          transaction.category = rule.categoryId;
        }
        if (rule.isArchived) {
          transaction.isArchived = rule.isArchived;
        }
        if (rule.setTitle) {
          transaction.title = rule.setTitle;
        }
        return transaction;
      });
      // await getManager().save(Transaction, transactions);
      updatedTransactions.push(...transactions);
    }
    return updatedTransactions;
  }
}
