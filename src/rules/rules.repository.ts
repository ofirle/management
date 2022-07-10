import { EntityRepository, getManager, Like, Repository } from 'typeorm';
import { Rule } from './rules.entity';
import { User } from '../auth/auth.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StringComparisonFunctions } from './dto/enum';
import { Transaction } from '../transactions/transaction.entity';

@EntityRepository(Rule)
export class RulesRepository extends Repository<Rule> {
  async getRuleFilter(ruleId: number, user: User): Promise<any> {
    const rule = await this.findOne({ id: ruleId, account: user.accountId });

    if (!rule) {
      throw new NotFoundException('Rule not found');
    }
    const filters = [];
    rule.conditions.title.forEach((condition) => {
      const value = condition.value;
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
    if (rule.type) {
      filters['type'] = rule.type;
    }

    return filters;
  }

  async createRule(data: createRulesDto, user: User): Promise<Rule> {
    const rule = new Rule();
    if (!data.conditions) {
      throw new BadRequestException('no condition has been set');
    }

    /* {
       "config": {
       "title": "משכורת אופיר סופרסוניק"
     },
       "conditions": [
       {
         "option": [
           "title",
           "CONTAINS"
         ],
         "value": "סופרסוניק"
       }
     ],
       "value": {
       "title": "משכורת סופרסוניק",
         "category": 19,
         "archived": "NO"
     }
     }*/

    const conditions = {
      title: [],
      price: [],
    };
    rule.title = data.config.title;
    data.conditions.forEach((condition) => {
      const conditionData = {
        comparisonFunction: condition.comparisonFunction,
        value: condition.value,
        isNegative: condition.isNegative,
      };
      if (condition.field === 'title') {
        conditions.title.push(conditionData);
      } else if (condition.field === 'price') {
        conditions.price.push(conditionData);
      } else {
        throw new Error(`Condition type not suppoerted: ${condition?.field}`);
      }
    });
    rule.value = JSON.stringify({
      title: data.value.title,
      category: data.value.category,
      isArchived: data.value.isArchived,
    });

    rule.type = data.type ?? null;

    rule.conditions = conditions;
    rule.account = user.accountId;
    // rule.conditions = conditions;
    // if (data.sourceIds) {
    //   rule.sources = data.sourceIds;
    //   // rule.sources = await getManager().findByIds(Source, data.sourceIds);
    // }
    rule.user = user.id;

    console.log(rule);
    // const { categoryId, isArchived, title } = data.setData;
    // rule.category = await getM anager().findOne(Category, categoryId);
    // rule.setTitle = title;
    // rule.isArchived = isArchived;
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

  async runRule(rule: Rule, transactions: Transaction[]): Promise<any> {
    const value = JSON.parse(rule.value);
    await Promise.all(
      transactions.map(async (transaction) => {
        transaction = {
          ...transaction,
          title: value.title ?? transaction.title,
          isArchived: value.isArchived ?? transaction.isArchived,
          category: value.category ?? transaction.category,
          rule: rule,
        };
        await getManager().getRepository(Transaction).save(transaction);
      }),
    );
    return { rule, transactions };
  }

  async getRules(user: User): Promise<Rule[]> {
    const rules = await this.find({
      where: [{ account: user.accountId }, { account: null }],
    });
    return rules;
  }

  // async runRules(user: User): Promise<Transaction[]> {
  //   const rules = await this.find({ account: user.accountId });
  //   const updatedTransactions = [];
  //   for (const rule of rules) {
  //     const filters = [];
  //     rule.conditions.title.forEach((condition) => {
  //       const value = condition.value.toLowerCase();
  //       switch (condition.comparisonFunction) {
  //         case StringComparisonFunctions.CONTAINS:
  //           filters['description'] = Like(`%${value}%`);
  //           break;
  //         case StringComparisonFunctions.EQUAL:
  //           filters['description'] = Like(`${value}`);
  //           break;
  //         case StringComparisonFunctions.START_WITH:
  //           filters['description'] = Like(`%${value}`);
  //           break;
  //         case StringComparisonFunctions.END_WITH:
  //           filters['description'] = Like(`${value}%`);
  //           break;
  //         default:
  //           throw new Error(
  //             `method ${condition.comparisonFunction} not supported yet`,
  //           );
  //       }
  //     });
  //     if (rule.transactionType) {
  //       filters['type'] = rule.transactionType;
  //     }
  //
  //     let transactions = await getManager().find(Transaction, {
  //       user,
  //       ...filters,
  //     });
  //     console.log(rule);
  //     transactions = transactions.map((transaction) => {
  //       if (rule.category) {
  //         transaction.category = rule.categoryId;
  //       }
  //       if (rule.isArchived) {
  //         transaction.isArchived = rule.isArchived;
  //       }
  //       if (rule.setTitle) {
  //         transaction.title = rule.setTitle;
  //       }
  //       return transaction;
  //     });
  //     // await getManager().save(Transaction, transactions);
  //     updatedTransactions.push(...transactions);
  //   }
  //   return updatedTransactions;
  // }

  // async runRules(user: User): Promise<Transaction[]> {
  //   const rules = await this.find({ account: user.accountId });
  //   const updatedTransactions = [];
  //   for (const rule of rules) {
  //     const filters = [];
  //     rule.conditions.title.forEach((condition) => {
  //       const value = condition.value.toLowerCase();
  //       switch (condition.comparisonFunction) {
  //         case StringComparisonFunctions.CONTAINS:
  //           filters['description'] = Like(`%${value}%`);
  //           break;
  //         case StringComparisonFunctions.EQUAL:
  //           filters['description'] = Like(`${value}`);
  //           break;
  //         case StringComparisonFunctions.START_WITH:
  //           filters['description'] = Like(`%${value}`);
  //           break;
  //         case StringComparisonFunctions.END_WITH:
  //           filters['description'] = Like(`${value}%`);
  //           break;
  //         default:
  //           throw new Error(
  //             `method ${condition.comparisonFunction} not supported yet`,
  //           );
  //       }
  //     });
  //     if (rule.transactionType) {
  //       filters['type'] = rule.transactionType;
  //     }
  //
  //     let transactions = await getManager().find(Transaction, {
  //       user,
  //       ...filters,
  //     });
  //     console.log(rule);
  //     transactions = transactions.map((transaction) => {
  //       if (rule.category) {
  //         transaction.category = rule.categoryId;
  //       }
  //       if (rule.isArchived) {
  //         transaction.isArchived = rule.isArchived;
  //       }
  //       if (rule.setTitle) {
  //         transaction.title = rule.setTitle;
  //       }
  //       return transaction;
  //     });
  //     // await getManager().save(Transaction, transactions);
  //     updatedTransactions.push(...transactions);
  //   }
  //   return updatedTransactions;
  // }
}
