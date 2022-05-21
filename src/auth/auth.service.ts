import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthSignupDto): Promise<{ id: number }> {
    return this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(
    authSignInCredentialsDto: AuthSignInDto,
  ): Promise<{ id: number; accessToken: string }> {
    const { username, password } = authSignInCredentialsDto;
    const user = await this.usersRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      console.log(`username: ${username} has successfully login`);
      return { id: user.id, accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    console.log('user' + JSON.stringify(user));
    return user;
  }
}
