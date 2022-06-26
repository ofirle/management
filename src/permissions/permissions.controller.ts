import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/auth.entity';
import { createPermissionsDto } from './dto/create-permissions.dto';
import { PermissionsService } from './permissions.service';
import { ActionsEnum } from '../shared/enum';

@Controller('permissions')
@UseGuards(AuthGuard())
export class PermissionsController {
  private logger = new Logger('Categories Controller');

  constructor(private permissionsService: PermissionsService) {}

  @Post('')
  @HttpCode(201)
  async createPermission(
    @Body() data: createPermissionsDto,
    @GetUser({ actions: ActionsEnum.CreatePermission }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `created new permissions. 
       data: ${JSON.stringify(data)}`,
    );
    try {
      const permission = this.permissionsService.createPermissions(data);
      return {
        data: permission,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('')
  @HttpCode(200)
  async getPermissions(
    @GetUser({ actions: ActionsEnum.ReadPermissions }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `retrieve all permissions. 
       user: ${user.username}`,
    );
    try {
      const permissions = await this.permissionsService.getPermissions();
      return {
        data: permissions,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
