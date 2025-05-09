import { SortDirection } from '@core/shared/domain/repository/search-params';

export class GetCategoriesDto {
  filter?: string;
  page?: number;
  per_page?: number;
  sort_dir?: SortDirection;
  sort?: string;
}
