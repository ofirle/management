import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthService } from './auth.service';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from './get-user.decorator';
import { ActionsEnum } from '../shared/enum';
import { User } from './auth.entity';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiCreatedResponse({ description: 'User Registration' })
  @ApiBody({ type: AuthSignupDto })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          console.log(`${randomName}${extname(file.originalname)}`);
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async signUp(
    @Body() authCreateCredentialsDto: AuthSignupDto,
    @UploadedFile() image,
  ): Promise<any> {
    authCreateCredentialsDto.image = image.filename;
    try {
      const user = await this.authService.signUp(authCreateCredentialsDto);
      return {
        data: user,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/signin')
  @ApiOkResponse({ description: 'User login' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ type: AuthSignInDto })
  async signIn(@Body() authSigninCredentialsDto: AuthSignInDto): Promise<any> {
    try {
      const accessToken = await this.authService.signIn(
        authSigninCredentialsDto,
      );
      return {
        data: accessToken,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/users')
  async getUsers(
    @GetUser({ actions: ActionsEnum.ReadUsers }) user: User,
  ): Promise<any> {
    try {
      const users = this.authService.getUsers();
      return {
        data: users,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/info')
  async getUser(@GetUser() user: User): Promise<any> {
    try {
      const userData = await this.authService.getUser(user.id);
      return {
        data: userData,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/users/:uid/roles/:rid')
  async attachRole(
    @GetUser({ actions: ActionsEnum.AttachUserRole }) user: User,
    @Param('uid') userId: number,
    @Param('rid') roleId: number,
  ): Promise<any> {
    try {
      const userData = await this.authService.attachRole(userId, roleId);
      return {
        data: userData,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
