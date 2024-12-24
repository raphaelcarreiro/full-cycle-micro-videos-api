import { CreateCategoryUseCase } from '@core/category/application/use-cases/create/create-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete/delete-category.use-case';
import { GetCategoriesUseCase } from '@core/category/application/use-cases/list/get-categories.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/show/get-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update/update-category.use-case';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategoryRepository } from '@core/category/infra/db/sequelize/category.repository';
import { getModelToken } from '@nestjs/sequelize';

export const REPOSITORIES = {
  CATEGORY_REPOSITORY: {
    provide: CategoryRepository,
    useExisting: CategoryRepository,
  },
  CATEGORY_IN_MEMORY_REPOSITORY: {
    provide: CategoryInMemoryRepository,
    useClass: CategoryInMemoryRepository,
  },
  CATEGORY_SEQUELIZE_REPOSITORY: {
    provide: CategoryRepository,
    useFactory: (model: typeof CategoryModel) => new CategoryRepository(model),
    inject: [getModelToken(CategoryModel)],
  },
};

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCategoryUseCase,
    useFactory: (repository: ICategoryRepository) => new CreateCategoryUseCase(repository),
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCategoryUseCase,
    useFactory: (repository: ICategoryRepository) => new UpdateCategoryUseCase(repository),
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCategoryUseCase,
    useFactory: (repository: ICategoryRepository) => new DeleteCategoryUseCase(repository),
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORIES_USE_CASE: {
    provide: GetCategoriesUseCase,
    useFactory: (repository: ICategoryRepository) => new GetCategoriesUseCase(repository),
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCategoryUseCase,
    useFactory: (repository: ICategoryRepository) => new GetCategoryUseCase(repository),
    inject: [REPOSITORIES.CATEGORY_REPOSITORY.provide],
  },
};

export const CATEGORY_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
