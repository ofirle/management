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
import { User } from '../auth/auth.entity';
import { Account } from '../accounts/accounts.entity';

@Entity()
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  value: number;

  @Column({
    nullable: true,
  })
  description: string;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category | number;

  @Column({ nullable: true })
  iconUrl: string;

  @OneToMany(() => Rule, (rule) => rule.category)
  rules: Rule[];

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[];

  @ManyToOne(() => User, (user) => user.categories, {
    nullable: true,
  })
  user: User;

  @ManyToOne(() => Account, (account) => account.categories, {
    nullable: true,
  })
  account: Account | number;
}
