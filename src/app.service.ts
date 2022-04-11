import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './auth/users.repository';
import { ClientsRepository } from './clients/clients.repository';
import { SupplierRepository } from './suppliers/supplier.repository';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(SupplierRepository)
    private supplierRepository: SupplierRepository,
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
    @InjectRepository(ClientsRepository)
    private clientRepository: ClientsRepository,
  ) {}
}
