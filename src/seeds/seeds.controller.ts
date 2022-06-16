import { Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { SeedsService } from './seeds.service';

@Controller('seeds')
export class SeedsController {
  private logger = new Logger('Seeds Controller');

  constructor(private seedService: SeedsService) {}

  @Post('/entities')
  @HttpCode(200)
  async createEntities(): Promise<void> {
    this.logger.verbose(`create entities`);
    try {
      // create user
      // create account
      // create rules
      // const account = await this.accountService.createAccount(data, user);
      // return account;
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  }

  @Post('')
  @HttpCode(200)
  async createInitData(): Promise<void> {
    this.logger.verbose(`create seeds`);
    try {
      await this.seedService.createSeeds();
      //create category
      //create permissions
      //create roles
      //create rules - dummy
    } catch (err) {
      console.log(err.message);
      return err.message;
    }
  }
}
