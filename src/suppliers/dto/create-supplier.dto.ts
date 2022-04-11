import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  phone: string;
  @IsString()
  email: string;
  @IsNotEmpty()
  supplier_type_id: string;
}
