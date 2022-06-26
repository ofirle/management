import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/auth.entity';
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
  async createRole(
    @Body() data: createRoleDto,
    @GetUser({ actions: ActionsEnum.CreateRole }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `created new role. 
       data: ${JSON.stringify(data)}`,
    );
    try {
      const role = await this.rolesService.createRole(data);
      return {
        data: role,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('')
  @HttpCode(200)
  async getRoles(
    @GetUser({ actions: ActionsEnum.ReadRoles }) user: User,
  ): Promise<any> {
    this.logger.verbose(`User "${user.username}", retrieving all roles.`);
    try {
      const roles = await this.rolesService.getRoles();
      return {
        data: roles,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id/:action')
  @HttpCode(200)
  async updateRolePermission(
    @Param('id') roleId: number,
    @Param('action') action: ActionsEnum,
    @GetUser({ actions: ActionsEnum.UpdateRolePermission }) user: User,
    @Body() data: updateRolePermissionDto,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", update role permission.
       role id: ${roleId}, action: ${action}`,
    );
    try {
      const role = await this.rolesService.updateRolePermission(
        roleId,
        action,
        data,
      );
      return {
        data: role,
        type: 1,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  @HttpCode(200)
  async updateRole(
    @Param('id') roleId: number,
    @GetUser({ actions: ActionsEnum.UpdateRole }) user: User,
    @Body() data: UpdateRoleDto,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", update role.
       role id: ${roleId}`,
    );
    try {
      const role = await this.rolesService.updateRole(roleId, data);
      return {
        data: role,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('/:id')
  @HttpCode(200)
  async deleteRole(
    @Param('id') roleId: number,
    @GetUser({ actions: ActionsEnum.DeleteRole }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", delete role.
       role id: ${roleId}`,
    );
    try {
      await this.rolesService.deleteRole(roleId);
      return {};
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
