import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../auth/auth.entity';
import { Type } from './dto/enums';
import { Source } from '../sources/sources.entity';
import { Category } from '../categories/categories.entity';
import { Account } from '../accounts/accounts.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  type: Type;
  @Column({ type: 'float' })
  amount: number;
  @Column({ type: 'date' })
  date: string;
  @Column({
    nullable: true,
  })
  note: string;
  @Column({ default: true })
  paid: boolean;
  @Column({ nullable: true })
  title: string;
  @Column()
  description: string;
  @Column()
  @Index({ unique: true })
  hash: string;
  @Column({ default: false })
  isArchived: boolean;
  @Column({ type: 'json', nullable: true })
  extraData: string;
  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
    eager: true,
  })
  category: Category | number;
  @RelationId((transaction: Transaction) => transaction.category)
  categoryId: number;
  @ManyToOne(() => Source, (source) => source.transactions, { eager: true })
  source: Source;
  @ManyToOne(() => User, (user) => user.transactions, { eager: true })
  user: User;
  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account | number;
  @CreateDateColumn()
  createdAt: Date;
}
