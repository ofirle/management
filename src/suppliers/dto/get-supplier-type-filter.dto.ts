import { IsOptional, IsString } from 'class-validator';

export class GetSupplierTypeFilter {
  @IsString()
  @IsOptional()
  search: string;
}
