import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';
import { Supplier } from './supplier.entity';

@Entity()
export class SupplierType {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  title: string;
  @ManyToOne((type) => User, (user) => user.supplier_types, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
