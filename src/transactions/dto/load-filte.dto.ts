import { IsDefined, IsString } from 'class-validator';

export class LoadFileDto {
  @IsDefined()
  @IsString()
  source?: string;
  @IsDefined()
  @IsString()
  file_name?: string;
}
