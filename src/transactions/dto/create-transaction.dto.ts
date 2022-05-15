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
import { User } from '../../users/user.entity';
import { Exclude } from 'class-transformer';
import { Category } from '../../categories/categories.entity';

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
  note: string;
  @IsOptional()
  @IsBoolean()
  paid: string;
  @IsString()
  @IsOptional()
  actionKey;
  @IsString()
  @IsNotEmpty()
  description;
  @IsString()
  @IsNotEmpty()
  certificationNumber;
  @IsString()
  @IsNotEmpty()
  hash: string;
  @ManyToOne((type) => User, (user) => user.transactions, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
  })
  category: Category;
}
