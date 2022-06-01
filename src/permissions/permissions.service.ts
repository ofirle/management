import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsRepository } from './permissions.repository';
import { Permission } from './permissions.entity';
import { createPermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionsRepository)
    private permissionsRepository: PermissionsRepository,
  ) {}

  async createPermission(data: createPermissionDto): Promise<Permission> {
    return this.permissionsRepository.createPermission(data);
  }
}
