import { EntityRepository, Repository } from 'typeorm';
import { Role } from './roles.entity';
import { createRoleDto } from './dto/create-role.dto';
import { Permission } from '../permissions/permissions.entity';

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
}
