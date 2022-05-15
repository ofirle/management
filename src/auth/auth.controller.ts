import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthService } from './auth.service';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
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
  signUp(
    @Body() authCreateCredentialsDto: AuthSignupDto,
    @UploadedFile() image,
  ): Promise<{ uid: string }> {
    authCreateCredentialsDto.image = image.filename;
    return this.authService.signUp(authCreateCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authSigninCredentialsDto: AuthSigninDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authSigninCredentialsDto);
  }

  @Get('/users')
  getUsers(): Promise<User[]> {
    return this.authService.getUsers();
  }

  @Get('/users/:uid')
  getUser(@Param('uid') id: string): Promise<User> {
    return this.authService.getUser(id);
  }
}
