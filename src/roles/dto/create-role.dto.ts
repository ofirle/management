import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ActionsEnum } from '../../shared/enum';

export class createRoleDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsArray()
  @IsOptional()
  actions: ActionsEnum[];
}
