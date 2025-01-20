import { setupSequelize } from '@core/category/infra/testing/helpers';
import { GetCastMemberUseCase } from '../get-cast-member.use-case';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberRepository } from '@core/cast-member/infra/db/sequelize/cast-member.repository';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('GetCastMemberUseCase Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  let usecase: GetCastMemberUseCase;
  let repository: CastMemberRepository;

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    usecase = new GetCastMemberUseCase(repository);
  });

  it('should get a category', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await repository.insert(entity);

    const spyOn = jest.spyOn(repository, 'findById');
    const output = await usecase.execute({ id: entity.cast_member_id.value });

    expect(output).toStrictEqual({
      id: entity.entity_id.value,
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
