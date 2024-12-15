import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('CreateCategoryUseCase Unit Tests', () => {
  let usecase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new CreateCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    const input = {
      name: 'name',
      description: 'description',
      is_active: true,
    };

    const insertSpy = jest.spyOn(repository, 'insert');
    const output = await usecase.execute(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.description).toBe(input.description);
    expect(output.is_active).toBe(input.is_active);
    expect(output.created_at).toBeInstanceOf(Date);
    expect(insertSpy).toHaveBeenCalled();
  });
});
