import { NestFactory } from '@nestjs/core';
import { MigrationModule } from './nest-modules/migration/migration.module';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { migrator } from './core/shared/infra/db/sequelize/migrator';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(MigrationModule, {
    logger: ['error'],
  });

  const sequelize = app.get<Sequelize>(getConnectionToken());

  migrator(sequelize).runAsCLI();
}

bootstrap();
