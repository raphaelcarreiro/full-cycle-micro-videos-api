import { CategoryId } from '@core/category/domain/category.aggregate';
import { GenreSearchParams } from '../genre.repository.interface';

describe('GenreSearchParams', () => {
  describe('constructor', () => {
    it('should set the filter property correctly', () => {
      const searchParams = new GenreSearchParams();

      expect(searchParams.filter).toBeNull();
    });

    it('should create with filter props', () => {
      const searchParams = new GenreSearchParams({
        filter: {
          name: 'test',
          category_ids: ['33679dfb-f54a-412c-95c3-7a3b63390bc9'],
        },
      });

      expect(searchParams.filter).toEqual({
        name: 'test',
        category_ids: [new CategoryId('33679dfb-f54a-412c-95c3-7a3b63390bc9')],
      });
    });
  });
});
