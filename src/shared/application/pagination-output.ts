import { SearchResult } from '../domain/repository/search-result';

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(items: Item[], searched: SearchResult): PaginationOutput<Item> {
    return {
      items,
      total: searched.total,
      current_page: searched.current_page,
      last_page: searched.last_page,
      per_page: searched.per_page,
    };
  }
}
