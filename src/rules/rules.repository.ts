import { EntityRepository, getManager, Like, Repository } from 'typeorm';
import { Rule } from './rules.entity';
import { User } from '../users/user.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { Category } from '../categories/categories.entity';
import { Transaction } from '../transactions/transaction.entity';
import { StringComparisonFunctions } from './dto/enum';

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
    rule.category = await getManager().findOne(Category, data.categoryId);
    // if (data.titleConditions) {
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
    return await this.save(rule);
    // return rule;
  }

  async runRules(user: User): Promise<any[]> {
    const rules = await this.find();
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
      let transactions = await getManager().find(Transaction, {
        user,
        ...filters,
      });
      console.log(rule);
      transactions = transactions.map((transaction) => {
        transaction.category = rule.category;
        return transaction;
      });
      await getManager().save(Transaction, transactions);
      console.log(transactions);
    }
    return [];
  }

  // async getRule(id: number, user: User): Promise<Rule> {}
}
