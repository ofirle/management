import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActionsEnum } from '../../shared/enum';
import { Admins } from '../enum';

export class createRoleDto {
  @IsEnum(Admins)
  @IsNotEmpty()
  key: Admins;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsArray()
  @IsOptional()
  actions: ActionsEnum[];
}
