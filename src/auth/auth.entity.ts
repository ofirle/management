import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Source } from '../sources/sources.entity';
import { Rule } from '../rules/rules.entity';
import { Category } from '../categories/categories.entity';
import { Account } from '../accounts/accounts.entity';
import { Role } from '../roles/roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => Transaction, (transactions) => transactions.user)
  transactions: Transaction[];

  @OneToMany(() => Source, (sources) => sources.user)
  sources: Source[];

  @OneToMany(() => Rule, (rules) => rules.user)
  rules: Rule[];

  @OneToMany(() => Category, (categories) => categories.user)
  categories: Category[];

  @ManyToOne(() => Account, (account) => account.user, {
    nullable: true,
  })
  account: Account | number;
  @RelationId((user: User) => user.account)
  accountId: number;

  @ManyToOne(() => Role, (role) => role.user, { nullable: true, eager: true })
  role: Role | number;
  // @RelationId((user: User) => user.role)
  // roleId: number;
}
