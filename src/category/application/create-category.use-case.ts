import { IUseCase } from '../../shared/application/use-case-interface';
import { Category } from '../domain/category.entity';
import { ICategoryRepository } from '../domain/category.repository.interface';

type Input = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

type Output = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export class CreateCategoryUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = Category.create({
      name: input.name,
      description: input.description,
      is_active: input.is_active,
    });

    await this.repository.insert(category);

    return {
      id: category.category_id.value,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    };
  }
}
