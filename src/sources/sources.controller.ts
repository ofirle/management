import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SourcesService } from './sources.service';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { createSourceDto } from './dto/create-source.dto';
import { Source } from './sources.entity';

@Controller('sources')
@UseGuards(AuthGuard())
export class SourcesController {
  private logger = new Logger('Sources Controller');

  constructor(private sourceService: SourcesService) {}

  @Post('')
  @HttpCode(201)
  async createSource(
    @Body() data: createSourceDto,
    @GetUser() user: User,
  ): Promise<Source> {
    this.logger.verbose(
      `User "${user.username}", create a new source. 
       data: ${JSON.stringify(data)}`,
    );
    try {
      const source = await this.sourceService.createSource(data, user);
      return source;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  }
}
