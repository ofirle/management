import { IsNotEmpty, IsString } from 'class-validator';

export class attachAccountDto {
  @IsString()
  @IsNotEmpty()
  secret: string;
}
