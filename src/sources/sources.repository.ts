import { EntityRepository, Repository } from 'typeorm';
import { Source } from './sources.entity';
import { User } from '../auth/auth.entity';
import { createSourceDto } from './dto/create-source.dto';
import { BankType, CreditCardType, SourceType } from './dto/enums';

@EntityRepository(Source)
export class SourcesRepository extends Repository<Source> {
  async createSource(data: createSourceDto, user: User): Promise<Source> {
    if (data.type === SourceType.BANK) {
      if (!Object.values(BankType).includes(data.typeKey as BankType)) {
        throw new Error(`Bank ${data.typeKey} is not supported`);
      }
    } else if (data.type === SourceType.CREDIT_CARD) {
      if (
        !Object.values(CreditCardType).includes(data.typeKey as CreditCardType)
      ) {
        throw new Error(`Credit Card ${data.typeKey} is not supported`);
      }
    }
    const source = this.create({ ...data, user: user.id });
    await this.save(source);
    return source;
  }
}
