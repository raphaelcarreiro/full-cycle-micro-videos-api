import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { GetCastMemberUseCase } from '../get-cast-member.use-case';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('GetCastMemberUseCase Unit Tests', () => {
  let usecase: GetCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    usecase = new GetCastMemberUseCase(repository);
  });

  it('should get a category', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await repository.insert(entity);

    const spyOn = jest.spyOn(repository, 'findById');
    const response = await usecase.execute({ id: entity.cast_member_id.value });

    expect(response).toStrictEqual({
      id: entity.cast_member_id.value,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
    expect(spyOn).toHaveBeenCalled();
  });

  it('should throw an error when category is not found', async () => {
    const id = new CastMemberId().value;

    await expect(usecase.execute({ id })).rejects.toThrow(NotFoundError);
  });
});
