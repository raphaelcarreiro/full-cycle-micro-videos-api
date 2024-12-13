import { Category } from '../../../../domain/category.entity';
import { CategorySearchParams } from '../../../../domain/category.repository.interface';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { CategoryOutputMapper } from '../../common/category-output';
import { GetCategoriesUseCase } from '../../list/get-categories.use-case';

describe('GetCategoriesUseCase Unit Tests', () => {
  let usecase: GetCategoriesUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new GetCategoriesUseCase(repository);
  });

  it('should list categories', async () => {
    const category1 = Category.fake().aCategory().withName('movie').build();
    const category2 = Category.fake().aCategory().withName('serie').build();
    const category3 = Category.fake().aCategory().withName('novel').build();
    const category4 = Category.fake().aCategory().withName('top 3 movies').build();
    const category5 = Category.fake().aCategory().withName('top 5 series').build();

    const items = [category1, category2, category3, category4, category5];

    await repository.bulkInsert(items);

    const input = {
      filter: 'novel',
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_direction: 'asc',
    };

    const searched = await usecase.execute(input);

    expect(searched).toStrictEqual({
      items: [CategoryOutputMapper.toOutput(category3)],
      current_page: 1,
      last_page: 1,
      total: 1,
      per_page: 2,
    });
  });

  it('should list categories', async () => {
    const category1 = Category.fake().aCategory().withName('movie').withCreatedAt(new Date('2024-12-01')).build();
    const category2 = Category.fake().aCategory().withName('serie').withCreatedAt(new Date('2024-12-02')).build();
    const category3 = Category.fake().aCategory().withName('novel').withCreatedAt(new Date('2024-12-03')).build();
    const category4 = Category.fake()
      .aCategory()
      .withName('top 3 movies')
      .withCreatedAt(new Date('2024-12-04'))
      .build();
    const category5 = Category.fake()
      .aCategory()
      .withName('top 5 series')
      .withCreatedAt(new Date('2024-12-05'))
      .build();

    const items = [category1, category2, category3, category4, category5];

    await repository.bulkInsert(items);

    const input = {
      filter: 'movie',
      page: 1,
    };

    const searched = await usecase.execute(input);

    expect(searched).toStrictEqual({
      items: [CategoryOutputMapper.toOutput(category1)],
      current_page: 1,
      last_page: 1,
      total: 1,
      per_page: 15,
    });
  });
});
