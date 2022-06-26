import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../auth/auth.entity';

@Entity()
@Index(['type', 'typeKey'], { unique: true })
export class Source {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  type: string;
  @Column()
  typeKey: string;
  @OneToMany(() => Transaction, (transaction) => transaction.source)
  transactions: Transaction[];
  @ManyToOne(() => User, (user) => user.sources)
  user: User | number;
}
