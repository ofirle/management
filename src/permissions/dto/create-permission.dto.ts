import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ActionsEnum } from '../../shared/enum';

export class createPermissionDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsEnum(ActionsEnum)
  action: ActionsEnum;
}
