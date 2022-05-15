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
  user;
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
  categoryIds: number[];
  @IsString()
  @IsOptional()
  dateStart: string;
  @IsString()
  @IsOptional()
  dateEnd: string;
}
