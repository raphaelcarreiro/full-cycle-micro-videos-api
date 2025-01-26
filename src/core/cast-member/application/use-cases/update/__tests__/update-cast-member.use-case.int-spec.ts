import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberRepository } from '@core/cast-member/infra/db/sequelize/cast-member.repository';
import { setupSequelize } from '@core/category/infra/testing/helpers';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import { CastMember, CastMemberId, CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('UpdateCastMemberUseCase Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  let usecase: UpdateCastMemberUseCase;
  let repository: ICastMemberRepository;

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    usecase = new UpdateCastMemberUseCase(repository);
  });

  it('should update a cast member', async () => {
    const castmember = CastMember.fake().aCastMember().build();

    await repository.insert(castmember);

    const input = {
      id: castmember.cast_member_id.value,
      name: 'new name',
      type: CastMemberType.actor,
    };

    const output = await usecase.execute(input);
    const entity = await repository.findById(castmember.cast_member_id);

    expect(output.id).toBe(entity.cast_member_id.value);
    expect(output.name).toBe(entity.name);
    expect(output.type).toBe(entity.type);
    expect(output.created_at).toStrictEqual(entity.created_at);
  });

  it('should update a cast member', async () => {
    const castmember = CastMember.fake().aCastMember().build();

    await repository.insert(castmember);

    const input = {
      id: castmember.cast_member_id.value,
      name: 'new name',
    };

    const output = await usecase.execute(input);
    const entity = await repository.findById(castmember.cast_member_id);

    expect(output.id).toBe(entity.cast_member_id.value);
    expect(output.name).toBe(entity.name);
    expect(output.type).toBe(entity.type);
    expect(output.created_at).toStrictEqual(entity.created_at);
  });

  it('should throw an error when category does not exist', async () => {
    const input = {
      id: new CastMemberId().value,
      name: 'new name',
    };

    await expect(usecase.execute(input)).rejects.toThrow(NotFoundError);
  });
});
