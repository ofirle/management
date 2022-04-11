import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSupplierTypeDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  @IsString()
  title: string;
}
