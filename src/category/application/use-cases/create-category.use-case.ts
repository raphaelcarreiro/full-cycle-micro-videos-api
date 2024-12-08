import { IUseCase } from '../../../shared/application/use-case-interface';
import { Category } from '../../domain/category.entity';
import { ICategoryRepository } from '../../domain/category.repository.interface';
import { CategoryOutput, CategoryOutputMapper } from './common/category-output';

type Input = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

type Output = CategoryOutput;

export class CreateCategoryUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = Category.create({
      name: input.name,
      description: input.description,
      is_active: input.is_active,
    });

    await this.repository.insert(category);

    return CategoryOutputMapper.toOutput(category);
  }
}
