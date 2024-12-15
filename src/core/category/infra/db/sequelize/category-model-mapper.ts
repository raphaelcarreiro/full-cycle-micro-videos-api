import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { CategoryModel } from './category.model';

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.category_id.value,
      name: entity.name,
      created_at: entity.created_at,
      is_active: entity.is_active,
      description: entity.description,
    });
  }

  static toEntity(model: CategoryModel): Category {
    return new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      created_at: model.created_at,
      is_active: model.is_active,
      description: model.description,
    });
  }
}
