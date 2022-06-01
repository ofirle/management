import { EntityRepository, In, Repository } from 'typeorm';
import { Permission } from './permissions.entity';
import { createPermissionDto } from './dto/create-permission.dto';
import { ActionsEnum } from '../shared/enum';

@EntityRepository(Permission)
export class PermissionsRepository extends Repository<Permission> {
  async createPermission(data: createPermissionDto): Promise<Permission> {
    try {
      const permission = new Permission();
      permission.title = data.title;
      permission.action = data.action;
      return this.save(permission);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async getPermissionsByAction(actions: ActionsEnum[]) {
    return this.find({ action: In(actions) });
  }
}
