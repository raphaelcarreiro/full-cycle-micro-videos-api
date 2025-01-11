import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { CategoryOutputMapper } from '../../src/core/category/application/use-cases/common/category-output';
import { Uuid } from '../../src/core/shared/domain/value-objects/uuid.vo';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import { Category } from '@core/category/domain/category.aggregate';
import { UpdateCategoryFixture } from 'src/nest-modules/categories/testing/category.fixture';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories/categories-providers';
import { CategoryPresenter } from 'src/nest-modules/categories/category.presenter';

describe('CategoriesController (e2e)', () => {
  const helper = startApp();

  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('/categories/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const faker = Category.fake().aCategory();

      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name },
          expected: {
            message: 'Category with id(s) 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a not found',
            statusCode: 404,
            error: 'Not found',
          },
        },
        {
          id: 'fake_id',
          send_data: { name: faker.name },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, send_data, expected }) => {
        return request(helper.app.getHttpServer())
          .patch(`/categories/${id}`)
          .send(send_data)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    describe('should a response error on 422 status code when request body is invalid', () => {
      const invalidRequest = UpdateCategoryFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map(key => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(helper.app.getHttpServer())
          .patch(`/categories/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with status code 422 when EntityValidationError', () => {
      const app = startApp();

      const validationError = UpdateCategoryFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(validationError).map(key => ({
        label: key,
        value: validationError[key],
      }));

      let repository: ICategoryRepository;

      beforeEach(() => {
        repository = app.app.get<ICategoryRepository>(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();

        await repository.insert(category);

        return request(app.app.getHttpServer())
          .patch(`/categories/${category.category_id.value}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a category', () => {
      const arrange = UpdateCategoryFixture.arrangeForUpdate();

      let repository: ICategoryRepository;

      beforeEach(async () => {
        repository = helper.app.get<ICategoryRepository>(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
      });
      test.each(arrange)('when body is $send_data', async ({ send_data, expected }) => {
        const category = Category.fake().aCategory().build();

        await repository.insert(category);

        const response = await request(helper.app.getHttpServer())
          .patch(`/categories/${category.category_id.value}`)
          .send(send_data)
          .expect(200);

        const updated = await repository.findById(new Uuid(response.body.data.id));

        const presenter = new CategoryPresenter(CategoryOutputMapper.toOutput(updated));
        const serialized = instanceToPlain(presenter);

        expect(Object.keys(response.body.data)).toStrictEqual(UpdateCategoryFixture.keysInResponse);
        expect(response.body.data).toStrictEqual(serialized);
        expect(response.body.data).toStrictEqual({
          id: serialized.id,
          created_at: serialized.created_at,
          name: expected.name ?? updated.name,
          description: expected.description ?? updated.description,
          is_active: expected.is_active ?? updated.is_active,
        });
      });
    });
  });
});
