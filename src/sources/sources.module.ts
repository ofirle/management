import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourcesRepository } from './sources.repository';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SourcesRepository]), AuthModule],
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule {}
