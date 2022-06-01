import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { Permission } from './permissions.entity';
import { createPermissionDto } from './dto/create-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
@UseGuards(AuthGuard())
export class PermissionsController {
  private logger = new Logger('Categories Controller');

  constructor(private permissionsService: PermissionsService) {}

  @Post('')
  @HttpCode(201)
  createPermission(
    @Body() data: createPermissionDto,
    @GetUser({ permissions: [] }) user: User,
  ): Promise<Permission> {
    this.logger.verbose(
      `created new permission. 
       data: ${JSON.stringify(data)}`,
    );
    return this.permissionsService.createPermission(data);
  }
}
