import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NumberComparisonFunctions, StringComparisonFunctions } from './enum';

export class RuleConditionDto {
  @IsNotEmpty()
  @IsString()
  field: string;
  @IsNotEmpty()
  comparisonFunction: StringComparisonFunctions | NumberComparisonFunctions;
  @IsNotEmpty()
  @IsString()
  value: string;
  @IsOptional()
  @IsBoolean()
  isNegative: boolean;
}
