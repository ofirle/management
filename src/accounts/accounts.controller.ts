import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { AccountsService } from './accounts.service';
import { createAccountDto } from './dto/create-account.dto';
import { attachAccountDto } from './dto/attach-account.dto';
import { ActionsEnum } from '../shared/enum';
import { User } from '../auth/auth.entity';

@Controller('accounts')
@UseGuards(AuthGuard())
export class AccountsController {
  private logger = new Logger('Accounts Controller');

  constructor(private accountService: AccountsService) {}

  @Post('')
  @HttpCode(201)
  async createAccount(
    @Body() data: createAccountDto,
    @GetUser({ actions: ActionsEnum.CreateAccount }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", create a new account. 
       data: ${JSON.stringify(data)}`,
    );
    try {
      const account = await this.accountService.createAccount(data, user);
      return {
        data: account,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/:id')
  @HttpCode(201)
  async attachUser(
    @Param('id') id: number,
    @Body() data: attachAccountDto,
    @GetUser({ actions: ActionsEnum.AttachAccountUser }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", attach user to account: ${id}
       data: ${JSON.stringify(data)}`,
    );
    try {
      const account = await this.accountService.attachUser(id, data, user);
      return {
        data: account,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
