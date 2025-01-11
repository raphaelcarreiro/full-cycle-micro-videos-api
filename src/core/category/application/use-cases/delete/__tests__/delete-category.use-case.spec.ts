import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.aggregate';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Unit Tests', () => {
  let usecase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    usecase = new DeleteCategoryUseCase(repository);
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const repositoryDeleteSpy = jest.spyOn(repository, 'delete');

    await usecase.execute({
      id: category.category_id.value,
    });

    expect(repositoryDeleteSpy).toHaveBeenCalled();
    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });

  it('should throw an error when category does not exist', async () => {
    const id = new Uuid().value;

    await expect(usecase.execute({ id })).rejects.toThrow(NotFoundError);
  });
});
