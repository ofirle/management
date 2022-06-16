import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config.schema';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { RulesModule } from './rules/rules.module';
import { SourcesModule } from './sources/sources.module';
import { AccountsModule } from './accounts/accounts.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { SeedsModule } from './seeds/seeds.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.dev`],
      validationSchema: configValidationSchema,
    }),
    AuthModule,
    PermissionsModule,
    TransactionsModule,
    CategoriesModule,
    RulesModule,
    SourcesModule,
    AccountsModule,
    RolesModule,
    SeedsModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  ],
})
export class AppModule {}
