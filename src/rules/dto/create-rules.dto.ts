import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { StringRuleConditionDto } from './string-rule-condition.dto';
import { NumberRuleConditionDto } from './number-rule-condition.dto';
import { Type } from 'class-transformer';
import { Type as TransactionType } from '../../transactions/dto/enums';
import { setDataDto } from './set-data.dto';
import { ConfigRuleDto } from './config-rule.dto';

export class createRulesDto {
  @ValidateNested()
  config: ConfigRuleDto;
  @IsString()
  @IsNotEmpty()
  conditions: string;
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
  @IsEnum(TransactionType)
  transactionType?: TransactionType;
  @IsOptional()
  @IsArray()
  sourceIds: number[];
  @IsDefined()
  @ValidateNested()
  setData: setDataDto;
}
