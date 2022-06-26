import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountsRepository } from '../accounts/accounts.repository';
import { User } from '../auth/auth.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    @InjectRepository(AccountsRepository)
    private accountsRepository: AccountsRepository,
  ) {}

  async getUserData(user: User): Promise<User> {
    user.account = await this.accountsRepository.getAccount(user.accountId);
    return user;
  }

  async updateUser(user: User, data: UpdateUserDto): Promise<User> {
    user = {
      ...user,
      ...data,
    };

    return await this.authRepository.save(user);
  }
}
