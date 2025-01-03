import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from 'src/app.module';
import { applyGlobalConfig } from 'src/global-config';

export function startApp() {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const sequelize = module.get<Sequelize>(getConnectionToken());

    await sequelize.sync({ force: true });

    app = module.createNestApplication();

    applyGlobalConfig(app);

    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  return {
    get app() {
      return app;
    },
  };
}
