import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberFilter, ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { SearchParams } from '@core/shared/domain/repository/search-params';
import { SearchableInMemoryRepository } from '@core/shared/infra/db/in-memory/searchable-in-memory.repository';

export class CastMemberInMemoryRepository
  extends SearchableInMemoryRepository<CastMember, CastMemberId, CastMemberFilter>
  implements ICastMemberRepository
{
  sortableFields = ['name', 'type', 'created_at'];

  protected async applyFilter(items: CastMember[], filter: CastMemberFilter): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    let _items = items;

    if (filter.name) {
      _items = items.filter(item => item.name.toLowerCase().includes(filter.name!.toLowerCase()));
    }

    if (filter.type) {
      _items = items.filter(item => item.type === filter.type);
    }

    return _items;
  }

  protected applySort(
    items: CastMember[],
    sort: string | null,
    sortDir: SearchParams['sort_direction'] | null,
  ): CastMember[] {
    return sort ? super.applySort(items, sort, sortDir) : super.applySort(items, 'created_at', 'desc');
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}
