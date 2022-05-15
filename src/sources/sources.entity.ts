import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { Transaction } from '../transactions/transaction.entity';
import { BankType } from './dto/enums';
import { User } from '../users/user.entity';

@Entity()
export class Source {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  @IsEnum(BankType)
  type: string;
  @Column()
  typeKey: string;
  @OneToMany(() => Transaction, (transaction) => transaction.source)
  transactions: Transaction[];
  @ManyToOne(() => User, (user) => user.sources)
  user: User;
}
