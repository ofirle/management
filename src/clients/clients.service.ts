import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientsRepository } from './clients.repository';
import { User } from '../auth/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(ClientsRepository)
    private clientRepository: ClientsRepository,
  ) {}

  async getClients(user: User): Promise<Client[]> {
    return this.clientRepository.getClients(user);
  }

  async createClient(
    createClientDto: CreateClientDto,
    user: User,
  ): Promise<Client> {
    return this.clientRepository.createClient(createClientDto, user);
  }

  async getClientById(id: string, user: User): Promise<Client> {
    console.log('Client ID: ' + id);
    const client = await this.clientRepository.findOne({ id, user });
    if (!client) {
      throw new NotFoundException(`client with id ${id} not found`);
    }

    return client;
  }
}
