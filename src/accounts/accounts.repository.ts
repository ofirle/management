import { EntityRepository, getManager, Repository } from 'typeorm';
import { Account } from './accounts.entity';
import { createAccountDto } from './dto/create-account.dto';
import { User } from '../auth/auth.entity';
import { attachAccountDto } from './dto/attach-account.dto';
import {
  ConflictException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

@EntityRepository(Account)
export class AccountsRepository extends Repository<Account> {
  async createAccount(data: createAccountDto, user: User): Promise<Account> {
    if (user.account) {
      throw new ConflictException('user already attached to existing account');
    }
    let secret = data.secret;
    if (!secret) {
      secret = (Math.random() + 1).toString(36).substring(2).toUpperCase();
    }
    const accountData = {
      title: data.title,
      secret,
    };
    const account = this.create(accountData);
    await this.save(account);
    user.account = account;
    await getManager().getRepository(User).save(user);
    return account;
  }

  async attachUser(
    accountId: number,
    data: attachAccountDto,
    user: User,
  ): Promise<Account> {
    if (user.account) {
      throw new ConflictException('user already attached to existing account');
    }
    const account = await this.getAccount(accountId);
    if (data.secret !== account.secret) {
      throw new NotAcceptableException(
        'secret provided to this account is not match',
      );
    }
    user.account = account;
    await getManager().getRepository(User).save(user);
    return account;
  }

  async getAccount(accountId) {
    const account = await this.findOne({ id: accountId });
    if (!account) {
      throw new NotFoundException('account id provided is not exist');
    }
    return account;
  }
}
