import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Category } from '../categories/categories.entity';
import { Rule } from '../rules/rules.entity';
import { User } from '../auth/auth.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  secret: string;
  @CreateDateColumn()
  createdAt: Date;
  @OneToMany(() => Rule, (rule) => rule.account)
  rules: Rule[];
  @OneToMany(() => Category, (category) => category.account)
  categories: Category[];
  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
  @OneToMany(() => User, (user) => user.account)
  user: User | number;
}
