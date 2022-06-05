import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionsRepository } from './permissions.repository';
import { Permission } from './permissions.entity';
import { createPermissionsDto } from './dto/create-permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionsRepository)
    private permissionsRepository: PermissionsRepository,
  ) {}

  async createPermissions(data: createPermissionsDto): Promise<Permission[]> {
    return this.permissionsRepository.createPermissions(data);
  }

  async getPermissions(): Promise<Permission[]> {
    return this.permissionsRepository.getPermissions();
  }
}
