import { Entity } from '../../../domain/entity';
import { ISearchableRepository } from '../../../domain/repository/repository.interface';
import { SearchParams } from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { ValueObject } from '../../../domain/value-object';
import { InMemoryRepository } from './in-memory.repository';

export abstract class SearchableInMemoryRepository<E extends Entity, EntityId extends ValueObject, Filter = string>
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const filtered = await this.applyFilter(this.items, props.filter);
    const sorted = this.applySort(filtered, props.sort, props.sort_direction);
    const paginated = this.applyPaginate(sorted, props.page, props.per_page);

    return new SearchResult<E>({
      items: paginated,
      total: filtered.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(items: E[], filter: Filter | null): Promise<E[]>;

  protected applyPaginate(items: E[], page: SearchParams['page'], per_page: SearchParams['per_page']) {
    const start = (page - 1) * per_page;
    const end = start + per_page;
    return items.slice(start, end);
  }

  protected applySort(
    items: E[],
    sort: SearchParams['sort'],
    sortDir: SearchParams['sort_direction'],
    customGetter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      //@ts-ignore
      const _a = customGetter ? customGetter(sort, a) : a[sort];
      //@ts-ignore
      const _b = customGetter ? customGetter(sort, b) : b[sort];

      if (_a > _b) {
        return sortDir === 'asc' ? 1 : -1;
      }

      if (_a < _b) {
        return sortDir === 'asc' ? -1 : 1;
      }

      return 0;
    });
  }
}
