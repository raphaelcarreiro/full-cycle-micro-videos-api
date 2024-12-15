import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.entity';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CategoryRepository } from '../../../../infra/db/sequelize/category.repository';
import { setupSequelize } from '../../../../infra/testing/helpers';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let usecase: DeleteCategoryUseCase;
  let repository: CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    usecase = new DeleteCategoryUseCase(repository);
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();

    const repositoryDeleteSpy = jest.spyOn(repository, 'delete');
    await repository.insert(category);

    const input = {
      id: category.category_id.value,
    };

    await usecase.execute(input);

    await expect(repository.findById(category.category_id)).resolves.toBeNull();
    expect(repositoryDeleteSpy).toHaveBeenCalled();
  });

  it('should throw an error when category does not exist', async () => {
    const id = new Uuid().value;

    await expect(usecase.execute({ id })).rejects.toThrow(NotFoundError);
  });
});
