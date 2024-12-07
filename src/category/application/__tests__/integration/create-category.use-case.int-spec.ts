import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { CategoryModel } from '../../../infra/db/sequelize/category.model';
import { CategoryRepository } from '../../../infra/db/sequelize/category.repository';
import { setupSequelize } from '../../../infra/testing/helpers';
import { CreateCategoryUseCase } from '../../create-category.use-case';

describe('CreateCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });
  let usecase: CreateCategoryUseCase;
  let repository: CategoryRepository;

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    usecase = new CreateCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    let output = await usecase.execute({
      name: 'name',
      description: 'description',
      is_active: true,
    });

    let entity = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: entity.category_id.value,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });

    output = await usecase.execute({
      name: 'name',
      description: 'description',
    });

    entity = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: entity.category_id.value,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });

    output = await usecase.execute({
      name: 'name',
    });

    entity = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: entity.category_id.value,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  });
});
