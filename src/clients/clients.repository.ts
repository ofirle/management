import { EntityRepository, Repository } from 'typeorm';
import { Client } from './client.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { CreateClientDto } from './dto/create-client.dto';

@EntityRepository(Client)
export class ClientsRepository extends Repository<Client> {
  private logger = new Logger('ClientRepository');

  async getClients(user: User): Promise<Client[]> {
    const query = this.createQueryBuilder('client');
    query.andWhere({ user });

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get clients for user "${user.username}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createClient(
    createClientDto: CreateClientDto,
    user: User,
  ): Promise<Client> {
    const { name, phone, email } = createClientDto;
    const client = this.create({
      name,
      phone,
      email,
      user,
    });

    await this.save(client);
    return client;
  }
}
