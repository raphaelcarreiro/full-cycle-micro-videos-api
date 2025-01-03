import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { Category } from '@core/category/domain/category.entity';
import { instanceToPlain } from 'class-transformer';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories/categories-providers';
import { CategoryPresenter } from 'src/nest-modules/categories/category.presenter';
import { GetCategoryFixture } from 'src/nest-modules/categories/testing/category.fixture';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  const helper = startApp();

  const arrange = [
    {
      id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
      expected: {
        message: 'Category with id(s) 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a not found',
        statusCode: 404,
        error: 'Not found',
      },
    },
    {
      id: 'fake_id',
      expected: {
        message: 'Validation failed (uuid is expected)',
        statusCode: 422,
        error: 'Unprocessable Entity',
      },
    },
  ];

  test.each(arrange)('by id', async ({ id, expected }) => {
    const response = await request(helper.app.getHttpServer()).get(`/categories/${id}`).expect(expected.statusCode);

    expect(response.body).toStrictEqual(expected);
  });

  it('should get a category', async () => {
    const repository = helper.app.get(CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);

    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const response = await request(helper.app.getHttpServer())
      .get(`/categories/${category.category_id.value}`)
      .expect(200);

    const presenter = new CategoryPresenter(CategoryOutputMapper.toOutput(category));
    const serilized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serilized);
    expect(Object.keys(response.body.data)).toStrictEqual(GetCategoryFixture.keysInResponse);
  });
});
