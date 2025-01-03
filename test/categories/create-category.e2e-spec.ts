import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import request from 'supertest';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories/categories-providers';
import { CreateCategoryFixture } from 'src/nest-modules/categories/testing/category.fixture';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import { CategoryPresenter } from 'src/nest-modules/categories/category.presenter';
import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { instanceToPlain } from 'class-transformer';

describe('CategoriesController (e2e)', () => {
  const helper = startApp();

  let repository: ICategoryRepository;

  beforeEach(async () => {
    repository = helper.app.get(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
  });

  describe('/categories (POST)', () => {
    describe('should return response error on 422 status code when request body is invalid', () => {
      const fixture = CreateCategoryFixture.arrangeInvalidRequest();

      const arrange = Object.keys(fixture).map(key => ({
        label: key,
        value: fixture[key],
      }));

      test.each(arrange)('when body is $label', async data => {
        await request(helper.app.getHttpServer())
          .post('/categories')
          .send(data.value.send_data)
          .expect(422)
          .expect(data.value.expected);
      });
    });

    describe('should return response error on 422 status code on entity validation', () => {
      const fixture = CreateCategoryFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(fixture).map(key => ({
        label: key,
        value: fixture[key],
      }));

      test.each(arrange)('when body is $label', async data => {
        await request(helper.app.getHttpServer())
          .post('/categories')
          .send(data.value.send_data)
          .expect(422)
          .expect(data.value.expected);
      });
    });

    describe('should create a category', () => {
      const arrange = CreateCategoryFixture.arrangeForCreate();

      test.each(arrange)('when body is $send_data', async data => {
        const response = await request(helper.app.getHttpServer()).post('/categories').send(data.send_data);

        const entity = await repository.findById(new Uuid(response.body.data.id));
        const presenter = instanceToPlain(new CategoryPresenter(CategoryOutputMapper.toOutput(entity)));

        expect(Object.keys(response.body.data)).toStrictEqual(CreateCategoryFixture.keysInResponse);
        expect(response.body.data).toStrictEqual(presenter);
      });
    });
  });
});
