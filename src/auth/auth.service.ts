import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { AuthSignInDto } from './dto/auth-sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from '../roles/roles.repository';
import { Admins } from '../roles/enum';
import { User } from './auth.entity';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: AuthRepository,
    private jwtService: JwtService,
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,
  ) {}

  async signUp(authCredentialsDto: AuthSignupDto): Promise<{ id: number }> {
    if (!authCredentialsDto.role) {
      authCredentialsDto.role = await this.rolesRepository.findOne({
        key: Admins.Admin,
      });
    }
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

  async getUsers(accountId: number = undefined): Promise<User[]> {
    const filter = {};
    if (accountId) {
      filter['accountId'] = accountId;
    }
    return await this.usersRepository.find(filter);
  }

  async getUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  async attachRole(userId: number, roleId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const role = await this.rolesRepository.findOne({ id: roleId });
    if (!role) {
      throw new NotFoundException('role not found');
    }
    return await this.usersRepository.attachRole(user, role);
  }
}
