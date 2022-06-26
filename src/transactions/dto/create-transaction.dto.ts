import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from './enums';
import { ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Category } from '../../categories/categories.entity';
import { User } from '../../auth/auth.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(Type)
  type: Type;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsString()
  date: string;
  @IsString()
  @IsOptional()
  title: string;
  @IsString()
  @IsOptional()
  note: string;
  @IsOptional()
  @IsBoolean()
  paid: string;
  @IsString()
  @IsOptional()
  actionKey: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsString()
  @IsNotEmpty()
  certificationNumber: string;
  @IsString()
  @IsNotEmpty()
  hash: string;
  @ManyToOne(() => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
  })
  category: Category;
  @IsOptional()
  @IsBoolean()
  isArchive: boolean;
}
