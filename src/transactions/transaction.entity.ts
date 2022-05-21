import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Exclude } from 'class-transformer';
import { Type } from './dto/enums';
import { Source } from '../sources/sources.entity';
import { Category } from '../categories/categories.entity';

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
  })
  category: Category | number;
  @ManyToOne(() => Source, (source) => source.transactions, { eager: true })
  source: Source;
  @ManyToOne(() => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
  @CreateDateColumn()
  createdAt: Date;
}
