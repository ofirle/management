import { EntityRepository, In, Repository } from 'typeorm';
import { Permission } from './permissions.entity';
import { createPermissionsDto } from './dto/create-permissions.dto';
import { ActionsEnum } from '../shared/enum';

@EntityRepository(Permission)
export class PermissionsRepository extends Repository<Permission> {
  async createPermissions(data: createPermissionsDto): Promise<Permission[]> {
    try {
      return this.save(data.permissions);
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  async getPermissionsByAction(actions: ActionsEnum[]) {
    return this.find({ action: In(actions) });
  }

  async getPermissions(): Promise<Permission[]> {
    return await this.find();
  }
}
