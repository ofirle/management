import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../clients/client.entity';
import { Supplier } from '../suppliers/supplier.entity';
import { SupplierType } from '../suppliers/supplierType.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  image: string;

  @OneToMany((type) => Client, (client) => client.user, { eager: true })
  clients: Client[];
  @OneToMany((type) => Supplier, (suppliers) => suppliers.user, { eager: true })
  suppliers: Supplier[];
  @OneToMany((type) => SupplierType, (supplier_type) => supplier_type.user, {
    eager: true,
  })
  supplier_types: SupplierType[];
}
