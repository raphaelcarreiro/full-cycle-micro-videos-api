import { IUseCase } from '../../../shared/application/use-case-interface';
import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../domain/category.entity';
import { ICategoryRepository } from '../../domain/category.repository.interface';
import { CategoryOutput, CategoryOutputMapper } from './common/category-output';

type Input = {
  id: string;
};

type Output = CategoryOutput;

export class GetCategoryUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.find(input.id);

    return CategoryOutputMapper.toOutput(category);
  }

  private async find(id: string) {
    const category = await this.repository.findById(new Uuid(id));

    if (!category) {
      throw new NotFoundError(id, Category);
    }

    return category;
  }
}
