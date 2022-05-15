import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../categories.entity';

export class createCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parent?: Category;
}
