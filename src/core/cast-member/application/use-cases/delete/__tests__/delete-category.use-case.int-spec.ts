import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { setupSequelize } from '@core/category/infra/testing/helpers';
import { DeleteCastMemberUseCase } from '../delete-cast-member.use-case';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CastMemberRepository } from '@core/cast-member/infra/db/sequelize/cast-member.repository';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('DeleteCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  let usecase: DeleteCastMemberUseCase;
  let repository: ICastMemberRepository;

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    usecase = new DeleteCastMemberUseCase(repository);
  });

  it('should delete a category', async () => {
    const entity = CastMember.fake().aCastMember().build();

    const repositoryDeleteSpy = jest.spyOn(repository, 'delete');
    await repository.insert(entity);

    const input = {
      id: entity.cast_member_id.value,
    };

    await usecase.execute(input);

    await expect(repository.findById(entity.cast_member_id)).resolves.toBeNull();
    expect(repositoryDeleteSpy).toHaveBeenCalled();
  });

  it('should throw an error when category does not exist', async () => {
    const id = new CastMemberId().value;

    await expect(usecase.execute({ id })).rejects.toThrow(NotFoundError);
  });
});
