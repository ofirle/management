import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SourcesService } from './sources.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/auth.entity';
import { createSourceDto } from './dto/create-source.dto';
import { ActionsEnum } from '../shared/enum';

@Controller('sources')
@UseGuards(AuthGuard())
export class SourcesController {
  private logger = new Logger('Sources Controller');

  constructor(private sourceService: SourcesService) {}

  @Post('')
  @HttpCode(201)
  async createSource(
    @Body() data: createSourceDto,
    @GetUser({ actions: ActionsEnum.CreateSource }) user: User,
  ): Promise<any> {
    this.logger.verbose(
      `User "${user.username}", create a new source. 
       data: ${JSON.stringify(data)}`,
    );
    try {
      const source = await this.sourceService.createSource(data, user);
      return {
        data: source,
      };
    } catch (err) {
      this.logger.error(err);
      if (err instanceof HttpException) throw err;
      return new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
