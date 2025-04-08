import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import { GenreFilter, IGenreRepository } from '@core/genre/domain/genre.repository.interface';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { SearchableInMemoryRepository } from '@core/shared/infra/db/in-memory/searchable-in-memory.repository';

export class GenreInMemoryRepository
  extends SearchableInMemoryRepository<Genre, GenreId, GenreFilter>
  implements IGenreRepository
{
  sortableFields = ['name', 'created_at'];

  protected async applyFilter(items: Genre[], filter: GenreFilter): Promise<Genre[]> {
    if (!filter) {
      return items;
    }

    return items.filter(genre => {
      const name = filter.name && genre.name.toLowerCase().includes(filter.name.toLowerCase());
      const ids = filter.category_ids && filter.category_ids.some(id => genre.category_ids.has(id.value));

      return filter.name && filter.category_ids ? name && ids : filter.name ? name : ids;
    });
  }

  protected applySort(items: Genre[], sort: string | null, sort_dir: SortDirection | null): Genre[] {
    return !sort ? super.applySort(items, 'created_at', 'desc') : super.applySort(items, sort, sort_dir);
  }

  getEntity(): new (...args: any[]) => Genre {
    return Genre;
  }
}
