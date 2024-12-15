import { PaginationOutput, PaginationOutputMapper } from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case-interface';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  CategoryFilter,
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../../domain/category.repository.interface';
import { CategoryOutput, CategoryOutputMapper } from '../common/category-output';

type Input = {
  filter?: CategoryFilter;
  page: number;
  per_page?: number;
  sort_dir?: SortDirection;
  sort?: string;
};

type Output = PaginationOutput<CategoryOutput>;

export class GetCategoriesUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const params = new CategorySearchParams({
      filter: input.filter,
      page: input.page,
      per_page: input.per_page,
      sort_direction: input.sort_dir,
      sort: input.sort,
    });

    const searched = await this.repository.search(params);

    return this.toOutput(searched);
  }

  private toOutput(searched: CategorySearchResult) {
    const items = searched.items.map(CategoryOutputMapper.toOutput);

    return PaginationOutputMapper.toOutput(items, searched);
  }
}
