import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCreateCredentialsDto } from './dto/auth-create-credentials.dto';
import { AuthSigninCredentialsDto } from './dto/auth-signin-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCreateCredentialsDto,
  ): Promise<{ uid: string }> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authSigninCredentialsDto: AuthSigninCredentialsDto,
  ): Promise<{ uid: string; accessToken: string }> {
    const { username, password } = authSigninCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      console.log(`username: ${username} has successfully login`);
      return { uid: user.id, accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    console.log('user' + JSON.stringify(user));
    return user;
  }
}
