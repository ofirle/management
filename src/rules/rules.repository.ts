import { EntityRepository, getManager, Like, Repository } from 'typeorm';
import { Rule } from './rules.entity';
import { User } from '../users/user.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { Category } from '../categories/categories.entity';
import { Transaction } from '../transactions/transaction.entity';
import { StringComparisonFunctions } from './dto/enum';
import { Source } from '../sources/sources.entity';
import { hideUserData } from '../shared/setData';

@EntityRepository(Rule)
export class RulesRepository extends Repository<Rule> {
  async createRule(data: createRulesDto, user: User): Promise<Rule> {
    console.log(data);
    const rule = new Rule();
    if (!data.titleConditions && !data.priceConditions)
      throw new Error('no condition has been set');
    const conditions = {
      title: data.titleConditions || [],
      price: data.priceConditions || [],
    };
    rule.title = data.title;
    rule.conditions = conditions;
    if (data.sourceIds) {
      rule.sources = await getManager().findByIds(Source, data.sourceIds);
    }
    rule.transactionType = data.transactionType ?? null;
    rule.user = user;
    const { categoryId, isArchived, title } = data.setData;
    if (categoryId) {
      rule.category = await getManager().findOne(Category, categoryId);
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
    rule.user = hideUserData(rule.user);
    return rule;
  }

  async runRules(user: User): Promise<Transaction[]> {
    const rules = await this.find();
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
          transaction.category = rule.category;
        }
        if (rule.isArchived) {
          transaction.isArchived = rule.isArchived;
        }
        if (rule.setTitle) {
          transaction.title = rule.setTitle;
        }
        return transaction;
      });
      await getManager().save(Transaction, transactions);
      updatedTransactions.push(...transactions);
    }
    return updatedTransactions;
  }
}
