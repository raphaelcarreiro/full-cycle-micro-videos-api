import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('DeleteCastMemberUseCase Unit Tests', () => {
  let usecase: DeleteCastMemberUseCase;
  let repository: ICastMemberRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    usecase = new DeleteCastMemberUseCase(repository);
  });

  it('should delete a cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await repository.insert(entity);

    const repositoryDeleteSpy = jest.spyOn(repository, 'delete');

    await usecase.execute({
      id: entity.cast_member_id.value,
    });

    expect(repositoryDeleteSpy).toHaveBeenCalled();
    await expect(repository.findById(entity.cast_member_id)).resolves.toBeNull();
  });

  it('should throw an error when category does not exist', async () => {
    const id = new CastMemberId().value;

    await expect(usecase.execute({ id })).rejects.toThrow(NotFoundError);
  });
});
