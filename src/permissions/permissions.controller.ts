import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { Permission } from './permissions.entity';
import { createPermissionsDto } from './dto/create-permissions.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
@UseGuards(AuthGuard())
export class PermissionsController {
  private logger = new Logger('Categories Controller');

  constructor(private permissionsService: PermissionsService) {}

  @Post('')
  @HttpCode(201)
  createPermission(
    @Body() data: createPermissionsDto,
    @GetUser() user: User,
  ): Promise<Permission[]> {
    this.logger.verbose(
      `created new permissions. 
       data: ${JSON.stringify(data)}`,
    );
    return this.permissionsService.createPermissions(data);
  }

  @Get('')
  @HttpCode(200)
  getPermissions(@GetUser() user: User): Promise<Permission[]> {
    this.logger.verbose(
      `retrieve all permissions. 
       user: ${user.username}`,
    );
    return this.permissionsService.getPermissions();
  }
}
