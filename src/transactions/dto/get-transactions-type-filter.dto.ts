import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetTransactionsTypeFilter {
  @IsString()
  @IsOptional()
  note: string;
  @IsString()
  @IsOptional()
  user;
  @IsString()
  @IsOptional()
  amountMin: number;
  @IsNumber()
  @IsOptional()
  amountMax: number;
  @IsArray()
  @IsOptional()
  types: string[];
  @IsString()
  @IsOptional()
  dateStart: string;
  @IsString()
  @IsOptional()
  dateEnd: string;
}
