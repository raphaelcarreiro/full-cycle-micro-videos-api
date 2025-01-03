import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { instanceToPlain } from 'class-transformer';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories/categories-providers';
import { CategoryPresenter } from 'src/nest-modules/categories/category.presenter';
import { ListCategoriesFixture } from 'src/nest-modules/categories/testing/category.fixture';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  describe('should return categories sorted by created_at when query params are not provided', () => {
    const helper = startApp();
    let repository: ICategoryRepository;

    const { arrange, entitiesMap } = ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

    beforeEach(async () => {
      repository = helper.app.get<ICategoryRepository>(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);

      await repository.bulkInsert(Object.values(entitiesMap));
    });

    test.each(arrange)('when query params is $send_data', async ({ send_data, expected }) => {
      const query = new URLSearchParams(send_data as any).toString();

      await request(helper.app.getHttpServer())
        .get('/categories')
        .query(query)
        .expect(200)
        .expect({
          data: expected.entities.map(entity =>
            instanceToPlain(new CategoryPresenter(CategoryOutputMapper.toOutput(entity))),
          ),
          meta: expected.meta,
        });
    });
  });

  describe('should return categories using paginate, filter and sort', () => {
    const helper = startApp();
    let repository: ICategoryRepository;

    const { arrange, entitiesMap } = ListCategoriesFixture.arrangeUnsorted();

    beforeEach(async () => {
      repository = helper.app.get<ICategoryRepository>(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);

      await repository.bulkInsert(Object.values(entitiesMap));
    });

    test.each([arrange[0]])('when query params is $send_data', async ({ send_data, expected }) => {
      const query = new URLSearchParams(send_data as any).toString();

      await request(helper.app.getHttpServer())
        .get('/categories')
        .query(query)
        .expect(200)
        .expect({
          data: expected.entities.map(entity =>
            instanceToPlain(new CategoryPresenter(CategoryOutputMapper.toOutput(entity))),
          ),
          meta: expected.meta,
        });
    });
  });
});
