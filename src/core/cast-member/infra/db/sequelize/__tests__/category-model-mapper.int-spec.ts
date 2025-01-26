import { setupSequelize } from '@core/category/infra/testing/helpers';
import { CastMemberModel } from '../cast-member.model';
import { CastMember, CastMemberId, CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberModelMapper } from '../cast-member-model-mapper';

describe('CastMemberModel tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  it('should map from model to entity', () => {
    const model = CastMemberModel.build({
      cast_member_id: new CastMemberId().value,
      name: 'name',
      type: CastMemberType.actor,
      created_at: new Date(),
    });

    const entity = CastMemberModelMapper.toEntity(model);

    expect(entity.cast_member_id.value).toBe(model.cast_member_id);
    expect(entity.name).toBe(model.name);
    expect(entity.type).toBe(model.type);
    expect(entity.created_at).toBe(model.created_at);
  });

  it('should map from entity to model', async () => {
    const entity = CastMember.fake().aCastMember().build();

    const model = CastMemberModelMapper.toModel(entity);

    expect(model.cast_member_id).toBe(entity.cast_member_id.value);
    expect(model.name).toBe(entity.name);
    expect(model.type).toBe(entity.type);
    expect(model.created_at).toBe(entity.created_at);
  });
});
