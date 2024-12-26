import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { PaginationOutput } from '@core/shared/application/pagination-output';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared/collection.presenter';

export class CategoriesPresenter {
  id: string;
  name: string;
  description: string | null;

  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.created_at = output.created_at;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoriesPresenter[];

  constructor({ items, ...props }: PaginationOutput<CategoryOutput>) {
    super(props);
    this.data = items.map(item => new CategoriesPresenter(item));
  }
}
