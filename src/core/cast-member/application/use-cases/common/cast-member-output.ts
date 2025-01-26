import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';

export type CastMemberOutput = {
  id: string;
  name: string;
  type: number;
  created_at: Date;
};

export class CastMemberOutputMapper {
  static toOutput(entity: CastMember): CastMemberOutput {
    const { cast_member_id, ...props } = entity.toJSON();

    return {
      ...props,
      id: cast_member_id,
    };
  }
}
