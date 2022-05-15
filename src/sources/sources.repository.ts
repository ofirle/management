import { EntityRepository, Repository } from 'typeorm';
import { Source } from './sources.entity';
import { User } from '../users/user.entity';
import { createSourceDto } from './dto/create-source.dto';

@EntityRepository(Source)
export class SourcesRepository extends Repository<Source> {
  async createSource(data: createSourceDto, user: User): Promise<Source> {
    const source = this.create(data);
    await this.save(source);
    return source;
  }
}
