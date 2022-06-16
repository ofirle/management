import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createAccountDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  secret?: string;
}
