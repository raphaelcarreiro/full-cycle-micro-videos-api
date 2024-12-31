import { PaginationOutput } from '@core/shared/application/pagination-output';
import { CategoryPresenter } from './category.presenter';
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { CollectionPresenter } from '../shared/collection.presenter';

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor({ items, ...props }: PaginationOutput<CategoryOutput>) {
    super(props);
    this.data = items.map(item => new CategoryPresenter(item));
  }
}
