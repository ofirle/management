import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RulesService } from './rules.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/auth.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { Rule } from './rules.entity';
import { TransactionsService } from '../transactions/transactions.service';
import { GetTransactionsTypeFilter } from '../transactions/dto/get-transactions-type-filter.dto';

@Controller('rules')
@UseGuards(AuthGuard())
export class RulesController {
  private logger = new Logger('Rules Controller');

  constructor(
    private ruleService: RulesService,
    private transactionsService: TransactionsService,
  ) {}

  @Post('')
  @HttpCode(201)
  createRule(
    @Body() data: createRulesDto,
    @GetUser() user: User,
  ): Promise<Rule> {
    this.logger.verbose(
      `User "${user.username}", create a new Rule.
      account: ${user.accountId}
       data: ${JSON.stringify(data)}`,
    );
    return this.ruleService.createRule(data, user);
  }

  // @Post('/run')
  // runRules(@GetUser() user: User): Promise<Transaction[]> {
  //   this.logger.verbose(
  //     `User "${user.username}", run all rules from account ${user.accountId}`,
  //   );
  //   return this.RuleService.runRules(user);
  // }

  @Post('/:id/run')
  async runRules(@GetUser() user: User, @Param('id') id: string): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", run rule id: ${id} from account ${user.accountId}`,
    );
    try {
      const response = this.ruleService.runRule(Number(id), user);
      return {
        type: 1,
        data: {
          transactions: [1, 2],
          rule: response,
        },
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('')
  getRules(@GetUser() user: User): Promise<Rule[]> {
    this.logger.verbose(
      `User "${user.username}", retrieve all rules from account ${user.accountId}`,
    );
    return this.ruleService.getRules(user);
  }

  @Delete('/:id')
  async deleteRule(
    @GetUser() user: User,
    @Param('id') id: string,
  ): Promise<any> {
    this.logger.verbose(`User "${user.username}", delete rule Id: ${id}`);
    try {
      const rule = await this.ruleService.getRule(Number(id), user);
      const filterDto = new GetTransactionsTypeFilter();
      filterDto.ruleId = id;
      let transactions = await this.transactionsService.getTransactions(
        filterDto,
        user,
      );
      transactions = await this.transactionsService.resetTransactions(
        transactions,
      );
      //
      await this.ruleService.deleteRule(Number(id));

      return {
        type: 1,
        data: {
          transactions: transactions,
          rule: rule,
        },
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Get('/:id')
  // getRule(@GetUser() user: User, @Param('id') id: string): Promise<Rule> {
  //   this.logger.verbose(`User "${user.username}", retrieving rule by id ${id}`);
  //   return this.RuleService.getRule(Number(id), user);
  // }
}
