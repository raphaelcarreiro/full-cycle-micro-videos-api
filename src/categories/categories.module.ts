import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategoryRepository } from '@core/category/infra/db/sequelize/category.repository';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoriesController],
  providers: [
    {
      provide: 'CategoryRepository',
      useFactory: model => new CategoryRepository(model),
      inject: [getModelToken(CategoryModel)],
    },
  ],
})
export class CategoriesModule {}
