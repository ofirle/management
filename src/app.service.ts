import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './auth/users.repository';
import { ClientsRepository } from './clients/clients.repository';
import { TransactionRepository } from './transactions/transaction.repository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    @InjectRepository(ClientsRepository)
    private clientRepository: ClientsRepository,
  ) {}
}
