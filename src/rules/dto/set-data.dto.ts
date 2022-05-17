import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class setDataDto {
  @IsString()
  @IsOptional()
  title: string;
  @IsOptional()
  @IsNumber()
  categoryId: number;
  @IsOptional()
  @IsBoolean()
  isArchived: boolean;
}
