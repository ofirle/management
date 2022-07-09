import { IsDefined, IsEnum } from 'class-validator';
import { Sources } from '../../sources/dto/enums';

export class LoadFileDto {
  @IsDefined()
  @IsEnum(Sources)
  source: Sources;
  file: any;
}
