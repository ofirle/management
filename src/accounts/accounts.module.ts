import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsRepository } from './accounts.repository';
import { AccountsService } from './accounts.service';
import { AuthModule } from '../auth/auth.module';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountsRepository]), AuthModule],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
