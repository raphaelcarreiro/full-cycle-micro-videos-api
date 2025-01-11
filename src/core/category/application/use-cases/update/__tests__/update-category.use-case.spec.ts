import { Category } from '../../../../domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { UpdateCategoryUseCase } from '../update-category.use-case';

describe('UpdateCategoryUseCase Unit Tests', () => {
  let usecase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new UpdateCategoryUseCase(repository);
  });

  it('should update a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const input = {
      id: category.category_id.value,
      name: 'name',
      description: 'description',
      is_active: false,
    };

    const repositoryUpdateSpy = jest.spyOn(repository, 'update');

    const output = await usecase.execute(input);
    const entity = await repository.findById(category.category_id);

    expect(output.id).toBe(entity.category_id.value);
    expect(output.name).toBe(entity.name);
    expect(output.description).toBe(entity.description);
    expect(output.is_active).toBe(entity.is_active);
    expect(output.created_at).toBe(entity.created_at);
    expect(repositoryUpdateSpy).toHaveBeenCalled();
  });
});
