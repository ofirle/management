import { IsArray, IsOptional, IsString } from 'class-validator';

export class GetTransactionsTypeFilter {
  @IsString()
  @IsOptional()
  description: string;
  @IsString()
  @IsOptional()
  note: string;
  @IsString()
  @IsOptional()
  usersId: string[];
  @IsString()
  @IsOptional()
  amountMin: number;
  @IsString()
  @IsOptional()
  amountMax: number;
  @IsArray()
  @IsOptional()
  types: string[];
  @IsArray()
  @IsOptional()
  categories: number[];
  @IsString()
  @IsOptional()
  dateStart: string;
  @IsString()
  @IsOptional()
  dateEnd: string;
}
