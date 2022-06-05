import { IsArray } from 'class-validator';
import { createPermissionDto } from './create-permission.dto';

export class createPermissionsDto {
  @IsArray()
  permissions: createPermissionDto[];
}
