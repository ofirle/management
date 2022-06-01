import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from './roles.repository';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuthModule } from '../auth/auth.module';
import { PermissionsRepository } from '../permissions/permissions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolesRepository, PermissionsRepository]),
    AuthModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
