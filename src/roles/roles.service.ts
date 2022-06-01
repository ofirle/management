import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from './roles.repository';
import { Role } from './roles.entity';
import { createRoleDto } from './dto/create-role.dto';
import { PermissionsRepository } from '../permissions/permissions.repository';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,
    @InjectRepository(PermissionsRepository)
    private permissionsRepository: PermissionsRepository,
  ) {}

  async createRole(data: createRoleDto): Promise<Role> {
    let permissions = [];
    if (data.actions) {
      console.log(data.actions);
      permissions = await this.permissionsRepository.getPermissionsByAction(
        data.actions,
      );
      console.log(permissions);
      if (permissions.length !== data.actions.length) {
        throw new NotFoundException('not all permission was found');
      }
    }
    return this.rolesRepository.createRole(data, permissions);
  }
}
