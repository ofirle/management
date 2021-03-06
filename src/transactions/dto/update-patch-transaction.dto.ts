import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Category, ExpenseType, Type } from './enums';
import { ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../auth/auth.entity';

export class UpdatePatchTransactionDto {
  @IsOptional()
  @IsEnum(Type)
  type?: Type;
  @IsOptional()
  @IsString()
  amount?: number;
  @IsOptional()
  @IsString()
  date?: string;
  @IsOptional()
  @IsString()
  note?: string;
  @IsOptional()
  @IsString()
  category?: Category;
  @ManyToOne((type) => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
  @IsOptional()
  @IsEnum(ExpenseType)
  expense?: ExpenseType;
  @IsOptional()
  paid?: string;
}
