import { Category } from '../../../domain/category.entity';

export type CategoryOutput = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    const { category_id: id, ...props } = entity.toJSON();

    return {
      ...props,
      id,
    };
  }
}
