import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupplierTypeDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
