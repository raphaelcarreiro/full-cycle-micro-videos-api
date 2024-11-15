import { SearchParams } from '../../../shared/domain/repository/search-params';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { InMemoryRepository } from '../../../shared/infra/db/in-memory/in-memory.repository';
import { SearchableInMemoryRepository } from '../../../shared/infra/db/in-memory/searchable-in-memory.repository';
import { Category } from '../../domain/category.entity';

export class CategoryInMemoryRepository extends SearchableInMemoryRepository<Category, Uuid> {
  sortableFields = ['name', 'created_at'];

  protected async applyFilter(items: Category[], filter: string): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item => item.name.toLowerCase() === filter.toLowerCase());
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sortDir: SearchParams['sort_direction'] | null,
  ): Category[] {
    return sort ? super.applySort(items, sort, sortDir) : super.applySort(items, 'created_at', 'desc');
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
