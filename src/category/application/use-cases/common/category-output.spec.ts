import { Category } from '../../../domain/category.entity';
import { CategoryOutputMapper } from './category-output';

describe('CategoryOutput Unit Tests', () => {
  it('should map category entity to category output', () => {
    const category = Category.fake().aCategory().build();

    const toJSONSpy = jest.spyOn(category, 'toJSON');
    const output = CategoryOutputMapper.toOutput(category);

    expect(output).toStrictEqual({
      id: category.category_id.value,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
    expect(toJSONSpy).toHaveBeenCalled();
  });
});
