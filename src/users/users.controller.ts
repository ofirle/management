import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/auth.entity';
import { ActionsEnum } from '../shared/enum';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

// import { AuthRepository } from '../auth/auth.repository';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  private logger = new Logger('Users Controller');

  constructor(private usersService: UsersService) {}

  @Get('/info')
  @HttpCode(200)
  async getInfo(
    @GetUser({ actions: ActionsEnum.ReadUser }) user: User,
  ): Promise<any> {
    console.log(user);
    this.logger.verbose(`User "${user.username}", get user: ${user.id} info.`);
    try {
      user = await this.usersService.getUserData(user);
      return {
        data: user,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('/')
  @HttpCode(200)
  async updateUser(
    @Param() id: number,
    @Body() data: UpdateUserDto,
    @GetUser({ actions: ActionsEnum.ReadUser }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", update previous user: ${JSON.stringify(
        user,
      )} new values: ${JSON.stringify(user)}`,
    );
    try {
      const userData = this.usersService.updateUser(user, data);
      return {
        type: 1,
        data: userData,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
