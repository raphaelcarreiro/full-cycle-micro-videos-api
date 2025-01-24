import {
  CastMemberFilter,
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from '@core/cast-member/domain/cast-member.repository.interface';
import { PaginationOutput, PaginationOutputMapper } from '@core/shared/application/pagination-output';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { CastMemberOutput, CastMemberOutputMapper } from '../common/cast-member-output';
import { IUseCase } from '@core/shared/application/use-case-interface';

export type Input = {
  filter?: CastMemberFilter;
  page?: number;
  per_page?: number;
  sort_dir?: SortDirection;
  sort?: string;
};

type Output = PaginationOutput<CastMemberOutput>;

export class GetCastMembersUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICastMemberRepository) {}

  async execute(input: Input): Promise<Output> {
    const params = new CastMemberSearchParams({
      filter: input.filter,
      page: input.page,
      per_page: input.per_page,
      sort_direction: input.sort_dir,
      sort: input.sort,
    });

    const searched = await this.repository.search(params);

    return this.toOutput(searched);
  }

  private toOutput(searched: CastMemberSearchResult) {
    const items = searched.items.map(CastMemberOutputMapper.toOutput);

    return PaginationOutputMapper.toOutput(items, searched);
  }
}
