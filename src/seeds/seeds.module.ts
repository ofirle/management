import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedsService } from './seeds.service';
import { AuthModule } from '../auth/auth.module';
import { SeedsController } from './seeds.controller';
import { CategoriesRepository } from '../categories/categories.repository';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { RolesRepository } from '../roles/roles.repository';
import { AccountsRepository } from '../accounts/accounts.repository';
import { AuthRepository } from '../auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriesRepository,
      PermissionsRepository,
      RolesRepository,
      AuthRepository,
      AccountsRepository,
    ]),
    AuthModule,
  ],
  controllers: [SeedsController],
  providers: [SeedsService],
})
export class SeedsModule {}
