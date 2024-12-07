import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository';
import { GetCategoryUseCase } from '../../get-category.use-case';

describe('GetCategoryUseCase Unit Tests', () => {
  let usecase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
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
