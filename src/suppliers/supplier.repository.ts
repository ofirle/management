import { EntityRepository, Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierType } from "./supplierType.entity";
@EntityRepository(Supplier)
export class SupplierRepository extends Repository<Supplier> {
  private logger = new Logger('ClientRepository');

  async getSupplier(id: string, user: User): Promise<Supplier> {
    return await this.findOne({ id, user });
  }

  async createSupplier(
    supplierType: SupplierType,
    createSupplierDto: CreateSupplierDto,
    user: User,
  ): Promise<Supplier> {
    const { name, phone, email, supplier_type_id } = createSupplierDto;
    const supplier = this.create({
      name,
      phone,
      email,
      supplierType: { id: supplier_type_id },
      user,
    });
    try {
      await this.save(supplier);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
    return supplier;
  }
}
