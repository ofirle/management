import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RulesRepository } from './rules.repository';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RulesRepository]), AuthModule],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
