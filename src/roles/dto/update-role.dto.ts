import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ActionsEnum } from '../../shared/enum';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsArray()
  @IsOptional()
  actions: ActionsEnum[];
}
