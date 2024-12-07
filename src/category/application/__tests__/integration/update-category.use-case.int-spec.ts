import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { CategoryModel } from '../../../infra/db/sequelize/category.model';
import { CategoryRepository } from '../../../infra/db/sequelize/category.repository';
import { setupSequelize } from '../../../infra/testing/helpers';
import { UpdateCategoryUseCase } from '../../update-category.use-case';

describe('UpdateCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let usecase: UpdateCategoryUseCase;
  let repository: CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    usecase = new UpdateCategoryUseCase(repository);
  });

  it('should update a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const input = {
      id: category.category_id.value,
      name: 'new name',
      description: 'new description',
      is_active: false,
    };

    const output = await usecase.execute(input);
    const entity = await repository.findById(category.category_id);

    expect(output.id).toBe(entity.category_id.value);
    expect(output.name).toBe(entity.name);
    expect(output.description).toBe(entity.description);
    expect(output.is_active).toBe(entity.is_active);
    expect(output.created_at).toStrictEqual(entity.created_at);
  });

  it('should update a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const input = {
      id: category.category_id.value,
      name: 'new name',
    };

    const output = await usecase.execute(input);
    const entity = await repository.findById(category.category_id);

    expect(output.id).toBe(entity.category_id.value);
    expect(output.name).toBe(entity.name);
    expect(output.description).toBe(entity.description);
    expect(output.is_active).toBe(entity.is_active);
    expect(output.created_at).toStrictEqual(entity.created_at);
  });

  it('should throw an error when category does not exist', async () => {
    const input = {
      id: new Uuid().value,
      name: 'new name',
    };

    await expect(usecase.execute(input)).rejects.toThrow(NotFoundError);
  });
});
