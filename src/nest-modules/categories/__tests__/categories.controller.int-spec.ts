import { Test } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { ConfigModule } from 'src/nest-modules/config/config.module';
import { DatabaseModule } from 'src/nest-modules/database/database.module';
import { CategoriesModule } from '../categories.module';
import { CATEGORY_PROVIDERS } from '../categories-providers';
import { CreateCategoryUseCase } from '@core/category/application/use-cases/create/create-category.use-case';
import { GetCategoriesUseCase } from '@core/category/application/use-cases/list/get-categories.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/show/get-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete/delete-category.use-case';
import { UpdateCategoryUseCase } from '@core/category/application/use-cases/update/update-category.use-case';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CreateCategoryFixture, ListCategoriesFixture, UpdateCategoryFixture } from '../testing/category.fixture';
import { CategoryPresenter } from '../category.presenter';
import { Category } from '@core/category/domain/category.entity';
import { CategoryCollectionPresenter } from '../category-collection.presenter';
import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';

describe('CategoriesController Integration Test', () => {
  let controller: CategoriesController;
  let repository: ICategoryRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    repository = module.get<ICategoryRepository>(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
  });
  it('should be defined', async () => {
    expect(controller['createUseCase']).toBeInstanceOf(CreateCategoryUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateCategoryUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteCategoryUseCase);
    expect(controller['getCategoryUseCase']).toBeInstanceOf(GetCategoryUseCase);
    expect(controller['getCategoriesUseCase']).toBeInstanceOf(GetCategoriesUseCase);
  });

  describe('should create a category', () => {
    const arrange = CreateCategoryFixture.arrangeForCreate();

    test.each(arrange)('when body is $send_data', async data => {
      const response = await controller.create(data.send_data);

      const entity = await repository.findById(new Uuid(response.id));

      expect(response).toStrictEqual(new CategoryPresenter(response));

      expect(entity.toJSON()).toStrictEqual({
        category_id: response.id,
        name: data.expected.name,
        description: data.expected.description,
        is_active: data.expected.is_active,
        created_at: response.created_at,
      });
    });
  });

  describe('should update a category', () => {
    const arrange = UpdateCategoryFixture.arrangeForUpdate();

    let category: Category;

    beforeEach(async () => {
      category = Category.fake().aCategory().build();
      await repository.insert(category);
    });

    test.each(arrange)('when body is $send_data', async data => {
      const response = await controller.update(category.category_id.value, data.send_data);

      const entity = await repository.findById(new Uuid(response.id));

      expect(response).toStrictEqual(new CategoryPresenter(response));

      expect(entity.toJSON()).toStrictEqual({
        category_id: response.id,
        name: data.expected.name ?? response.name,
        description: data.expected.description ?? response.description,
        is_active: data.expected.is_active,
        created_at: response.created_at,
      });
    });
  });

  describe('should delete a category', () => {
    let category: Category;

    beforeEach(async () => {
      category = Category.fake().aCategory().build();
      await repository.insert(category);
    });

    it('by id', async () => {
      const response = await controller.remove(category.category_id.value);

      const entity = await repository.findById(category.category_id);

      expect(entity).toBeNull();
      expect(response).toBeUndefined();
    });
  });

  describe('should get a category', () => {
    let category: Category;

    beforeEach(async () => {
      category = Category.fake().aCategory().build();
      await repository.insert(category);
    });

    it('by id', async () => {
      const response = await controller.findOne(category.category_id.value);

      expect(response).toStrictEqual(new CategoryPresenter(response));
      expect(category.toJSON()).toStrictEqual({
        category_id: response.id,
        name: response.name,
        description: response.description,
        is_active: response.is_active,
        created_at: response.created_at,
      });
    });
  });

  describe('should search categories', () => {
    const { arrange, entitiesMap } = ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

    beforeEach(async () => {
      await repository.bulkInsert(Object.values(entitiesMap));
    });

    test.each([arrange[0]])('when query is $$send_data', async data => {
      const response = await controller.search(data.send_data);

      const { entities, ...paginationProps } = data.expected;

      expect(response).toEqual(
        new CategoryCollectionPresenter({
          items: entities.map(CategoryOutputMapper.toOutput),
          ...paginationProps.meta,
        }),
      );
    });
  });

  describe('should search categories', () => {
    const { arrange, entitiesMap } = ListCategoriesFixture.arrangeUnsorted();

    beforeEach(async () => {
      await repository.bulkInsert(Object.values(entitiesMap));
    });

    test.each([arrange[0]])('when query is $$send_data', async data => {
      const response = await controller.search(data.send_data);

      const { entities, ...paginationProps } = data.expected;

      expect(response).toEqual(
        new CategoryCollectionPresenter({
          items: entities.map(CategoryOutputMapper.toOutput),
          ...paginationProps.meta,
        }),
      );
    });
  });
});
