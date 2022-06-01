import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { AccountsService } from './accounts.service';
import { createAccountDto } from './dto/create-account.dto';
import { Account } from './accounts.entity';
import { attachAccountDto } from './dto/attach-account.dto';

@Controller('accounts')
@UseGuards(AuthGuard())
export class AccountsController {
  private logger = new Logger('Accounts Controller');

  constructor(private accountService: AccountsService) {}

  @Post('')
  @HttpCode(201)
  async createAccount(
    @Body() data: createAccountDto,
    @GetUser() user: User,
  ): Promise<Account> {
    this.logger.verbose(
      `User "${user.username}", create a new account. 
       data: ${JSON.stringify(data)}`,
    );
    try {
      const account = await this.accountService.createAccount(data, user);
      return account;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  }

  @Post('/:id')
  @HttpCode(201)
  async attachUser(
    @Param('id') id: number,
    @Body() data: attachAccountDto,
    @GetUser() user: User,
  ): Promise<Account> {
    this.logger.verbose(
      `User "${user.username}", attach to account: ${id}
       data: ${JSON.stringify(data)}`,
    );
    try {
      return await this.accountService.attachUser(id, data, user);
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  }
}
