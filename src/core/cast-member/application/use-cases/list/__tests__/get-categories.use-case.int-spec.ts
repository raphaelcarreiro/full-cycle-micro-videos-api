import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { GetCategoriesUseCase } from '@core/category/application/use-cases/list/get-categories.use-case';
import { Category } from '@core/category/domain/category.aggregate';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategoryRepository } from '@core/category/infra/db/sequelize/category.repository';
import { setupSequelize } from '@core/category/infra/testing/helpers';

describe('GetCategoriesUseCase Unit Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let usecase: GetCategoriesUseCase;
  let repository: CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
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
      items: [CategoryOutputMapper.toOutput(category4), CategoryOutputMapper.toOutput(category1)],
      current_page: 1,
      last_page: 1,
      total: 2,
      per_page: 15,
    });
  });
});
