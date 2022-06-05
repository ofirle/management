import { IsBoolean, IsNotEmpty } from 'class-validator';

export class updateRolePermissionDto {
  @IsNotEmpty()
  @IsBoolean()
  value: boolean;
}
