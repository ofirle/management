import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Rule } from '../rules/rules.entity';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category | number;

  @OneToMany(() => Rule, (rule) => rule.category)
  rules: Rule[];

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @ManyToOne(() => User, (user) => user.categories)
  user: User;
}
