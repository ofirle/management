import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { NumberComparisonFunctions } from './enum';

export class NumberRuleConditionDto {
  @IsNotEmpty()
  @IsEnum(NumberComparisonFunctions)
  comparisonFunction: NumberComparisonFunctions;
  @IsNotEmpty()
  @IsNumber()
  value: number;
  @IsOptional()
  @IsBoolean()
  isNegative: boolean;
}
