import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberModel } from './cast-member.model';

export class CastMemberModelMapper {
  static toModel(entity: CastMember): CastMemberModel {
    return CastMemberModel.build({
      cast_member_id: entity.cast_member_id.value,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CastMemberModel): CastMember {
    return new CastMember({
      cast_member_id: new CastMemberId(model.cast_member_id),
      name: model.name,
      type: model.type,
      created_at: model.created_at,
    });
  }
}
