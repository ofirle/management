import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsRepository } from './accounts.repository';
import { User } from '../users/user.entity';
import { createAccountDto } from './dto/create-account.dto';
import { Account } from './accounts.entity';
import { attachAccountDto } from './dto/attach-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsRepository)
    private accountRepository: AccountsRepository, // @InjectRepository(UsersRepository) // private userRepository: UsersRepository,
  ) {}

  async createAccount(data: createAccountDto, user: User): Promise<Account> {
    const account = await this.accountRepository.createAccount(data, user);
    // await this.userRepository.attachAccount(account.id, user, account.secret);
    return account;
  }

  async attachUser(
    accountId: number,
    data: attachAccountDto,
    user: User,
  ): Promise<Account> {
    const account = await this.accountRepository.attachUser(
      accountId,
      data,
      user,
    );
    return account;
  }
}
