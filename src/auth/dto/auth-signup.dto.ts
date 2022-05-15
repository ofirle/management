import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthSignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password: string;
  image: any;
}
