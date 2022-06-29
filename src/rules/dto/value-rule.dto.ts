import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ValueRuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsNotEmpty()
  category: number;
  @IsBoolean()
  @IsNotEmpty()
  isArchived: boolean;
}
