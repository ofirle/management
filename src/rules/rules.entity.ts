import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Account } from '../accounts/accounts.entity';
import { Type } from '../transactions/dto/enums';
import { Transaction } from '../transactions/transaction.entity';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: 'json' })
  conditions;
  @Column({ type: 'json' })
  value;
  @Column({ nullable: true })
  type: Type;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, (user) => user.rules)
  user: User | number;
  @ManyToOne(() => Account, (account) => account.rules, {
    nullable: true,
  })
  account: Account | number;
  @OneToMany(() => Transaction, (transaction) => transaction.rule, {
    nullable: true,
  })
  transactions: Transaction[];
}
