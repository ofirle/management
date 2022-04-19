import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class SupplierType {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  title: string;
  @ManyToOne((type) => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
