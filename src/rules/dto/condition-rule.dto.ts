import { IsDefined, IsString } from 'class-validator';

export class ConfigRuleDto {
  @IsString()
  @IsDefined()
  title: string;
}
