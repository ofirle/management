import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { CreateSupplierTypeDto } from './dto/create-supplier-type.dto';
import { SupplierType } from './supplierType.entity';
import { GetSupplierTypeFilter } from './dto/get-supplier-type-filter.dto';
@EntityRepository(SupplierType)
export class SupplierTypeRepository extends Repository<SupplierType> {
  private logger = new Logger('SupplierTypeRepository');

  async getSupplierType(id: string, user: User): Promise<SupplierType> {
    return await this.findOne({ id, user });
  }

  async getSupplierTypes(
    filterDto: GetSupplierTypeFilter,
    user: User,
  ): Promise<SupplierType[]> {
    const query = this.createQueryBuilder('supplier_type');
    query.andWhere({ user });
    const { search } = filterDto;
    if (search) {
      query.andWhere('(LOWER(supplier_type.title) LIKE :search)', {
        search: `%${search.toLowerCase()}%`,
      });
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get supplier_type for user "${
          user.username
        }". Filter: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createSupplierType(
    createSupplierTypeDto: CreateSupplierTypeDto,
    user: User,
  ): Promise<SupplierType> {
    const { title } = createSupplierTypeDto;
    const supplierType = this.create({
      title,
      user,
    });

    await this.save(supplierType);
    return supplierType;
  }

  async updateSupplierType(
    id,
    createSupplierTypeDto: CreateSupplierTypeDto,
    user: User,
  ): Promise<SupplierType> {
    const { title } = createSupplierTypeDto;
    const supplierType = await this.findOne({ id, user });
    if (!supplierType) {
      throw new NotFoundException(`supplier type with id: ${id}`);
    }
    supplierType.title = title;
    await this.save(supplierType);
    return supplierType;
  }
}
