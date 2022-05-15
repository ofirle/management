import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SourceType } from './enums';

export class createSourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsEnum(SourceType)
  @IsNotEmpty()
  type: SourceType;
  @IsString()
  @IsNotEmpty()
  typeKey: string;
}
