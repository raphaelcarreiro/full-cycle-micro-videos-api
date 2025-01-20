import { CategoryModel } from '../category.model';
import { CategoryModelMapper } from '../category-model-mapper';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.aggregate';
import { setupSequelize } from '../../../testing/helpers';

describe('CategoryModelMapper tests', () => {
  setupSequelize({ models: [CategoryModel] });

  it('should map from model to entity', () => {
    const model = CategoryModel.build({
      category_id: new Uuid().value,
      name: 'name',
      description: 'description',
      created_at: new Date(),
      is_active: true,
    });

    const entity = CategoryModelMapper.toEntity(model);

    expect(entity.category_id.value).toBe(model.category_id);
    expect(entity.name).toBe(model.name);
    expect(entity.is_active).toBe(model.is_active);
    expect(entity.description).toBe(model.description);
  });

  it('should map from entity to model', async () => {
    const entity = Category.fake().aCategory().build();

    const model = CategoryModelMapper.toModel(entity);

    expect(model.category_id).toBe(entity.category_id.value);
    expect(model.name).toBe(entity.name);
    expect(model.is_active).toBe(entity.is_active);
    expect(model.description).toBe(entity.description);
  });
});
