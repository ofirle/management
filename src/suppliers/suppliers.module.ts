import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierRepository } from './supplier.repository';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { AuthModule } from '../auth/auth.module';
import { SupplierTypeRepository } from './supplier.type.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupplierRepository, SupplierTypeRepository]),
    AuthModule,
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
})
export class SuppliersModule {}
