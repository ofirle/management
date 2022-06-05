import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { Role } from './roles.entity';
import { createRoleDto } from './dto/create-role.dto';
import { updateRolePermissionDto } from './dto/update-role-permission.dto';
import { ActionsEnum } from '../shared/enum';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
@UseGuards(AuthGuard())
export class RolesController {
  private logger = new Logger('Categories Controller');

  constructor(private rolesService: RolesService) {}

  @Post('')
  @HttpCode(201)
  createRole(
    @Body() data: createRoleDto,
    @GetUser() user: User,
  ): Promise<Role> {
    this.logger.verbose(
      `created new role. 
       data: ${JSON.stringify(data)}`,
    );
    return this.rolesService.createRole(data);
  }

  @Get('')
  @HttpCode(200)
  async getRoles(@GetUser() user: User): Promise<any> {
    this.logger.verbose(`User "${user.username}", retrieving all roles.`);
    const roles = await this.rolesService.getRoles();

    return {
      type: 1,
      data: roles,
    };
  }

  @Put('/:id/:action')
  @HttpCode(200)
  async updateRolePermission(
    @Param('id') roleId: number,
    @Param('action') action: ActionsEnum,
    @GetUser() user: User,
    @Body() data: updateRolePermissionDto,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", update role permission.
       role id: ${roleId}`,
    );
    const role = await this.rolesService.updateRolePermission(
      roleId,
      action,
      data,
    );

    return {
      type: 1,
      data: role,
    };
  }

  @Put('/:id')
  @HttpCode(200)
  async updateRole(
    @Param('id') roleId: number,
    @GetUser() user: User,
    @Body() data: UpdateRoleDto,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", update role.
       role id: ${roleId}`,
    );
    const role = await this.rolesService.updateRole(roleId, data);

    return {
      type: 1,
      data: role,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  async deleteRole(
    @Param('id') roleId: number,
    @GetUser() user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", delete role.
       role id: ${roleId}`,
    );
    await this.rolesService.deleteRole(roleId);

    return {
      type: 1,
    };
  }
}
