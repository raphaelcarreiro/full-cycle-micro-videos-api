import { IUseCase } from '../../../../shared/application/use-case-interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Category } from '../../../domain/category.entity';
import { ICategoryRepository } from '../../../domain/category.repository.interface';
import { CategoryOutput, CategoryOutputMapper } from '../common/category-output';
import { CreateCategoryInput } from './create-category.input';

type Input = CreateCategoryInput;

type Output = CategoryOutput;

export class CreateCategoryUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = Category.create({
      name: input.name,
      description: input.description,
      is_active: input.is_active,
    });

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.repository.insert(category);

    return CategoryOutputMapper.toOutput(category);
  }
}
