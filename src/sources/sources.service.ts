import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SourcesRepository } from './sources.repository';
import { User } from '../users/user.entity';
import { createSourceDto } from './dto/create-source.dto';
import { Source } from './sources.entity';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(SourcesRepository)
    private sourceRepository: SourcesRepository,
  ) {}

  async createSource(data: createSourceDto, user: User): Promise<Source> {
    return this.sourceRepository.createSource(data, user);
  }
}
