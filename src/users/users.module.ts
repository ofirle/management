import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { AccountsRepository } from '../accounts/accounts.repository';
import { AuthRepository } from '../auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountsRepository, AuthRepository]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
