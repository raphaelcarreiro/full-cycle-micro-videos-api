import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { SearchParams } from '@core/shared/domain/repository/search-params';
import { SearchableInMemoryRepository } from '@core/shared/infra/db/in-memory/searchable-in-memory.repository';

export class CastMemberInMemoryRepository
  extends SearchableInMemoryRepository<CastMember, CastMemberId>
  implements ICastMemberRepository
{
  sortableFields = ['name', 'type', 'created_at'];

  protected async applyFilter(items: CastMember[], filter: string): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    return items.filter(item => item.name.toLowerCase() === filter.toLowerCase());
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
