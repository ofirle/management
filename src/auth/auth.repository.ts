import { EntityRepository, Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthSignupDto } from '../auth/dto/auth-signup.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/roles.entity';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async createUser(
    authCreateCredentialsDto: AuthSignupDto,
  ): Promise<{ id: number }> {
    const { username, password, email, name, image, role } =
      authCreateCredentialsDto;
    //hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
      email,
      name,
      image,
      role,
    });
    try {
      const userCreated = await this.save(user);
      delete userCreated.password;
      return userCreated;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username or email already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async attachRole(user: User, role: Role): Promise<User> {
    user.role = role;
    return await this.save(user);
  }
}
