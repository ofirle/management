import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RulesService } from './rules.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/auth.entity';
import { createRulesDto } from './dto/create-rules.dto';
import { Rule } from './rules.entity';
import { Transaction } from '../transactions/transaction.entity';

@Controller('rules')
@UseGuards(AuthGuard())
export class RulesController {
  private logger = new Logger('Rules Controller');

  constructor(private RuleService: RulesService) {}

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
    return this.RuleService.createRule(data, user);
  }

  @Post('/run')
  runRules(@GetUser() user: User): Promise<Transaction[]> {
    this.logger.verbose(
      `User "${user.username}", run all rules from account ${user.accountId}`,
    );
    return this.RuleService.runRules(user);
  }

  @Get('')
  getRules(@GetUser() user: User): Promise<Rule[]> {
    this.logger.verbose(
      `User "${user.username}", retrieve all rules from account ${user.accountId}`,
    );
    return this.RuleService.getRules(user);
  }

  // @Get('/:id')
  // getRule(@GetUser() user: User, @Param('id') id: string): Promise<Rule> {
  //   this.logger.verbose(`User "${user.username}", retrieving rule by id ${id}`);
  //   return this.RuleService.getRule(Number(id), user);
  // }
}
