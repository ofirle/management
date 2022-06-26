import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/roles.entity';

export class AuthSignupDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
  })
  name: string;
  @IsNotEmpty()
  @ApiProperty({
    type: String,
  })
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({
    type: String,
    minLength: 4,
    maxLength: 20,
  })
  username: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @ApiProperty({
    type: String,
    maxLength: 20,
  })
  password: string;
  @ApiProperty()
  image: any;
  @IsOptional()
  @ApiProperty({
    type: Role,
  })
  role?: Role;
}
