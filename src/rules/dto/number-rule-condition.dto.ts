import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { NumberComparisonFunctions, StringComparisonFunctions } from './enum';

export class NumberRuleConditionDto {
  @IsNotEmpty()
  @IsEnum(StringComparisonFunctions)
  comparisonFunction: NumberComparisonFunctions;
  @IsNotEmpty()
  @IsNumber()
  value: number;
  @IsOptional()
  @IsBoolean()
  isNegative: boolean;
}
