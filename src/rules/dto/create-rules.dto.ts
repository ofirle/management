import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StringRuleConditionDto } from './string-rule-condition.dto';
import { NumberRuleConditionDto } from './number-rule-condition.dto';
import { Type } from 'class-transformer';

export class createRulesDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StringRuleConditionDto)
  titleConditions: StringRuleConditionDto[];
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NumberRuleConditionDto)
  priceConditions: NumberRuleConditionDto[];
  @IsOptional()
  @IsArray()
  sourceIds: number[];
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
