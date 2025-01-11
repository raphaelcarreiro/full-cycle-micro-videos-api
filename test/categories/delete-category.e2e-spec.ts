import { Category } from '@core/category/domain/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/category.repository.interface';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories/categories-providers';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const helper = startApp();

    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message: 'Category with id(s) 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a not found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('by id', async ({ id, expected }) => {
        const response = await request(helper.app.getHttpServer())
          .delete(`/categories/${id}`)
          .expect(expected.statusCode);

        expect(response.body).toStrictEqual(response.body);
      });
    });

    it('should delete a category response with status 204', async () => {
      const categoryRepo = helper.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );

      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      await request(helper.app.getHttpServer()).delete(`/categories/${category.category_id.value}`).expect(204);

      await expect(categoryRepo.findById(category.category_id)).resolves.toBeNull();
    });
  });
});
