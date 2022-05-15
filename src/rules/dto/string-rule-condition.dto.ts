import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StringComparisonFunctions } from './enum';

export class StringRuleConditionDto {
  @IsNotEmpty()
  @IsEnum(StringComparisonFunctions)
  comparisonFunction: StringComparisonFunctions;
  @IsNotEmpty()
  @IsString()
  value: string;
  @IsOptional()
  @IsBoolean()
  isNegative: boolean;
}
