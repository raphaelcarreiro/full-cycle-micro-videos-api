import { IUseCase } from '../../../../shared/application/use-case-interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { ICategoryRepository } from '../../../domain/category.repository.interface';
import { CategoryOutput, CategoryOutputMapper } from '../common/category-output';
import { UpdateCategoryInput } from './update-category.input';

type Input = UpdateCategoryInput;

type Output = CategoryOutput;

export class UpdateCategoryUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.find(input.id);

    const changed = this.change(category, input);

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.repository.update(changed);

    return CategoryOutputMapper.toOutput(changed);
  }

  private change(category: Category, input: Input): Category {
    const map = {
      name: () => category.changeName(input.name),
      description: () => category.changeDescription(input.description),
      is_active: this.changeIsActive.bind(this, input.is_active, category),
    };

    Object.keys(input).forEach(key => {
      if (key in map) {
        map[key as keyof typeof map]();
      }
    });

    return category;
  }

  private changeIsActive(isActive: boolean, category: Category) {
    isActive ? category.activate() : category.deactivate();

    return category;
  }

  private async find(id: string) {
    const category = await this.repository.findById(new Uuid(id));

    if (!category) {
      throw new NotFoundError(id, Category);
    }

    return category;
  }
}
