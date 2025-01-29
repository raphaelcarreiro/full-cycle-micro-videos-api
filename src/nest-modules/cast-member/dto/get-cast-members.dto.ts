import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class GetCastMembersDto {
  filter?: string;

  @IsOptional()
  @IsEnum(CastMemberType)
  @Type(() => Number)
  type?: number;

  page?: number;
  per_page?: number;
  sort_dir?: SortDirection;
  sort?: string;
}
