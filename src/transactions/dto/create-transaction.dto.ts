import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category, ExpenseType, Type } from './enums';
import { ManyToOne } from 'typeorm';
import { User } from '../../auth/user.entity';
import { Exclude } from 'class-transformer';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;
  @IsNotEmpty()
  @IsString()
  amount: number;
  @IsNotEmpty()
  @IsString()
  date: string;
  @IsString()
  note: string;
  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;
  @ManyToOne((type) => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
  @IsNotEmpty()
  @IsEnum(ExpenseType)
  expense: ExpenseType;
  @IsOptional()
  paid: string;
}
