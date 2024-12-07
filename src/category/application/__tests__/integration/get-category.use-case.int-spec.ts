import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { CategoryModel } from '../../../infra/db/sequelize/category.model';
import { CategoryRepository } from '../../../infra/db/sequelize/category.repository';
import { setupSequelize } from '../../../infra/testing/helpers';
import { GetCategoryUseCase } from '../../get-category.use-case';

describe('GetCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let usecase: GetCategoryUseCase;
  let repository: CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    usecase = new GetCategoryUseCase(repository);
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const spyOn = jest.spyOn(repository, 'findById');
    const response = await usecase.execute({ id: category.category_id.value });

    expect(response).toStrictEqual({
      id: category.category_id.value,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
    expect(spyOn).toHaveBeenCalled();
  });

  it('should throw an error when category is not found', async () => {
    const id = new Uuid().value;

    await expect(usecase.execute({ id })).rejects.toThrow(NotFoundError);
  });
});
