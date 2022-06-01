import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesService } from './roles.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { Role } from './roles.entity';
import { createRoleDto } from './dto/create-role.dto';

@Controller('roles')
@UseGuards(AuthGuard())
export class RolesController {
  private logger = new Logger('Categories Controller');

  constructor(private rolesService: RolesService) {}

  @Post('')
  @HttpCode(201)
  createRole(
    @Body() data: createRoleDto,
    @GetUser({ permissions: [] }) user: User,
  ): Promise<Role> {
    this.logger.verbose(
      `created new role. 
       data: ${JSON.stringify(data)}`,
    );
    return this.rolesService.createRole(data);
  }
}
