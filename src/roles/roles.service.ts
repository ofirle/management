import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from './roles.repository';
import { Role } from './roles.entity';
import { createRoleDto } from './dto/create-role.dto';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { updateRolePermissionDto } from './dto/update-role-permission.dto';
import { ActionsEnum } from '../shared/enum';
import { UpdateRoleDto } from './dto/update-role.dto';

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

  async getRoles(): Promise<Role[]> {
    // let permissions = [];
    // permissions = await this.permissionsRepository.getPermissions();
    return this.rolesRepository.getRoles();
  }

  async updateRolePermission(
    roleId: number,
    action: ActionsEnum,
    data: updateRolePermissionDto,
  ): Promise<Role> {
    const permission = await this.permissionsRepository.getPermissionsByAction([
      action,
    ]);
    if (permission.length === 0) {
      throw new NotFoundException('permission not found');
    }
    return this.rolesRepository.updateRolePermission(
      roleId,
      permission[0],
      data.value,
    );
  }

  async updateRole(roleId: number, data: UpdateRoleDto): Promise<Role> {
    let permissions = [];
    if (data.actions) {
      permissions = await this.permissionsRepository.getPermissionsByAction(
        data.actions,
      );
      console.log(permissions);
      if (permissions.length !== data.actions.length) {
        throw new NotFoundException('not all permission was found');
      }
    }
    return this.rolesRepository.updateRole(roleId, data, permissions);
  }

  async deleteRole(roleId: number): Promise<Role> {
    return this.rolesRepository.deleteRole(roleId);
  }
}
