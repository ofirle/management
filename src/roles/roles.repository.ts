import { EntityRepository, Repository } from 'typeorm';
import { Role } from './roles.entity';
import { createRoleDto } from './dto/create-role.dto';
import { Permission } from '../permissions/permissions.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateRoleDto } from './dto/update-role.dto';

@EntityRepository(Role)
export class RolesRepository extends Repository<Role> {
  async createRole(
    data: createRoleDto,
    permissions: Permission[],
  ): Promise<Role> {
    try {
      const role = {
        title: data.title,
        permissions: permissions,
      };

      return await this.save(role);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      return await this.find();
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async updateRolePermission(
    roleId: number,
    permission: Permission,
    value: boolean,
  ): Promise<Role> {
    try {
      const role = await this.findOne({ id: roleId });
      if (!role) {
        throw new NotFoundException('role not found');
      }
      const hasPermission = role.permissions.some(
        (rolePermission) => rolePermission.action === permission.action,
      );
      if (value) {
        if (hasPermission) {
          throw new ConflictException(
            'role already assigned to this permission',
          );
        }
        role.permissions.push(permission);
      } else {
        if (!hasPermission) {
          throw new ConflictException('role not assigned to this permission');
        }
        role.permissions = role.permissions.filter(
          (rolePermission) => rolePermission.id !== permission.id,
        );
      }

      await this.save(role);
      return role;
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async updateRole(
    roleId: number,
    data: UpdateRoleDto,
    permissions: Permission[],
  ): Promise<Role> {
    try {
      const role = await this.findOne({ id: roleId });
      role.title = data.title;
      role.permissions = permissions;
      return await this.save(role);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async deleteRole(roleId: number): Promise<any> {
    try {
      const role = await this.findOne({ id: roleId });
      await this.remove(role);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }
}
