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
import { ClientsService } from './clients.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './client.entity';

@Controller('clients')
@UseGuards(AuthGuard())
export class ClientsController {
  private logger = new Logger('ClientsController');

  constructor(private clientsService: ClientsService) {}

  @Get()
  getClients(@GetUser() user: User): Promise<Client[]> {
    this.logger.verbose(`User "${user.username}", retrieving all clients.`);
    return this.clientsService.getClients(user);
  }

  @Post()
  @HttpCode(201)
  createClient(
    @Body() createClientDto: CreateClientDto,
    @GetUser() user: User,
  ): Promise<Client> {
    this.logger.verbose(
      `User "${user.username}", create a new client. 
       data: ${JSON.stringify(createClientDto)}`,
    );
    return this.clientsService.createClient(createClientDto, user);
  }
}
