import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';
import { CastMember, CastMemberType } from '@core/cast-member/domain/cast-member.entity';

describe('UpdateCastMemberUseCase Unit Tests', () => {
  let usecase: UpdateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    usecase = new UpdateCastMemberUseCase(repository);
  });

  it('should update a cast member', async () => {
    const castmember = CastMember.fake().aCastMember().withType(CastMemberType.director).build();

    await repository.insert(castmember);

    const input = {
      id: castmember.cast_member_id.value,
      name: 'new name',
      type: 1,
    };

    const repositoryUpdateSpy = jest.spyOn(repository, 'update');

    const output = await usecase.execute(input);
    const entity = await repository.findById(castmember.cast_member_id);

    expect(output.id).toBe(entity.cast_member_id.value);
    expect(output.name).toBe(entity.name);
    expect(output.type).toBe(entity.type);
    expect(output.created_at).toBe(entity.created_at);
    expect(repositoryUpdateSpy).toHaveBeenCalled();
  });
});
