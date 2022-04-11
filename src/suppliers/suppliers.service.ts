import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierRepository } from './supplier.repository';
import { User } from '../auth/user.entity';
import { CreateSupplierTypeDto } from './dto/create-supplier-type.dto';
import { SupplierTypeRepository } from './supplier.type.repository';
import { SupplierType } from './supplierType.entity';
import { GetSupplierTypeFilter } from './dto/get-supplier-type-filter.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Supplier } from './supplier.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SupplierRepository)
    private supplierRepository: SupplierRepository,
    @InjectRepository(SupplierTypeRepository)
    private supplierTypeRepository: SupplierTypeRepository,
  ) {}

  async getSupplier(id: string, user: User): Promise<Supplier> {
    return this.supplierRepository.getSupplier(id, user);
  }

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
    user: User,
  ): Promise<Supplier> {
    const { supplier_type_id } = createSupplierDto;
    const supplier_type = await this.getSupplierType(supplier_type_id, user);
    console.log(supplier_type_id);
    console.log(supplier_type);
    return this.supplierRepository.createSupplier(
      supplier_type,
      createSupplierDto,
      user,
    );
  }

  async getSupplierTypes(
    filterDto: GetSupplierTypeFilter,
    user: User,
  ): Promise<SupplierType[]> {
    return this.supplierTypeRepository.getSupplierTypes(filterDto, user);
  }

  async getSupplierType(id: string, user: User): Promise<SupplierType> {
    return this.supplierTypeRepository.getSupplierType(id, user);
  }

  async createSupplierType(
    createSupplierTypeDto: CreateSupplierTypeDto,
    user: User,
  ): Promise<SupplierType> {
    return this.supplierTypeRepository.createSupplierType(
      createSupplierTypeDto,
      user,
    );
  }

  async updateSupplierType(
    id,
    createSupplierTypeDto: CreateSupplierTypeDto,
    user: User,
  ): Promise<SupplierType> {
    return this.supplierTypeRepository.updateSupplierType(
      id,
      createSupplierTypeDto,
      user,
    );
  }
}
