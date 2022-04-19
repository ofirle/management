import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';
import { Category, Type } from './dto/enums';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  type: Type;
  @Column()
  amount: number;
  @Column({ type: 'date' })
  date: string;
  @Column()
  note: string;
  @Column()
  category: Category;
  // @ManyToOne(
  //   (type) => RepetitionTransaction,
  //   (repetitionTransaction) => repetitionTransaction.transaction,
  //   { eager: false },
  // )
  // @Exclude({ toPlainOnly: true })
  // transactionRepetition: RepetitionTransaction;
  @ManyToOne((type) => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
  @Column({ default: true })
  paid: boolean;
}
