import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { SupplierType } from './supplierType.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  phone: string;
  @Column({
    nullable: true,
  })
  @IsEmail()
  email: string;

  @OneToOne(() => SupplierType, { eager: true })
  @JoinColumn()
  supplierType: SupplierType;

  @ManyToOne((type) => User, (user) => user.suppliers, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
