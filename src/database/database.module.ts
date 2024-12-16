import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      host: ':memory:',
      logging: false,
      models: [CategoryModel],
    }),
  ],
})
export class DatabaseModule {}
