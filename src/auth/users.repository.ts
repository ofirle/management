import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCreateCredentialsDto } from './dto/auth-create-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(
    authCreateCredentialsDto: AuthCreateCredentialsDto,
  ): Promise<{ uid: string }> {
    const { username, password, email, name, image } = authCreateCredentialsDto;
    //hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: hashedPassword,
      email,
      name,
      image,
    });
    try {
      const userCreated = await this.save(user);
      console.log(userCreated);
      return { uid: userCreated.id };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('username or email already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
