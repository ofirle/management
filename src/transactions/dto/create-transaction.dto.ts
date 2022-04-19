import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category, ExpenseType, Type } from './enums';
import { ManyToOne } from 'typeorm';
import { User } from '../../auth/user.entity';
import { Exclude } from 'class-transformer';

export class CreateTransactionDto {
  @IsNotEmpty()
  type: Type;
  @IsNotEmpty()
  @IsString()
  amount: number;
  @IsNotEmpty()
  date: string;
  @IsString()
  note: string;
  @IsString()
  category: Category;
  @ManyToOne((type) => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
  @IsNotEmpty()
  expense: ExpenseType;
  @IsOptional()
  paid: string;
}
