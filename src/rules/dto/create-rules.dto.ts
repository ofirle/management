import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { RuleConditionDto } from './string-rule-condition.dto';
import { Type } from '../../transactions/dto/enums';
import { ConfigRuleDto } from './config-rule.dto';
import { ValueRuleDto } from './value-rule.dto';

export class createRulesDto {
  @IsNotEmpty()
  @ValidateNested()
  config: ConfigRuleDto;
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  conditions: RuleConditionDto[];
  @IsNotEmpty()
  @ValidateNested({ each: true })
  value: ValueRuleDto;
  @IsOptional()
  @IsEnum(Type)
  type?: Type;
}
