import { IsOptional, IsString } from 'class-validator';

export class GetClientFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
