import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberOutputMapper } from './cast-member-output';

describe('CastMemeberOutput Unit Tests', () => {
  it('should map cast member entity to cast member output', () => {
    const entity = CastMember.fake().aCastMember().build();

    const toJSONSpy = jest.spyOn(entity, 'toJSON');
    const output = CastMemberOutputMapper.toOutput(entity);

    expect(output).toStrictEqual({
      id: entity.cast_member_id.value,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
    expect(toJSONSpy).toHaveBeenCalled();
  });
});
