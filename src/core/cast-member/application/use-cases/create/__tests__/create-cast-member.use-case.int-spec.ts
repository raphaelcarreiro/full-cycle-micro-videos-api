import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberRepository } from '@core/cast-member/infra/db/sequelize/cast-member.repository';
import { setupSequelize } from '@core/category/infra/testing/helpers';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';
import { CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';

describe('CreateCategoryUseCase Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });
  let usecase: CreateCastMemberUseCase;
  let repository: CastMemberRepository;

  beforeEach(() => {
    repository = new CastMemberRepository(CastMemberModel);
    usecase = new CreateCastMemberUseCase(repository);
  });

  it('should create a category', async () => {
    let output = await usecase.execute({
      name: 'name',
      type: 1,
    });

    let entity = await repository.findById(new CastMemberId(output.id));

    expect(output).toStrictEqual({
      id: entity.cast_member_id.value,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });

    output = await usecase.execute({
      name: 'name',
      type: 1,
    });

    entity = await repository.findById(new CastMemberId(output.id));

    expect(output).toStrictEqual({
      id: entity.cast_member_id.value,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });

    output = await usecase.execute({
      name: 'name',
      type: 1,
    });

    entity = await repository.findById(new CastMemberId(output.id));

    expect(output).toStrictEqual({
      id: entity.cast_member_id.value,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
  });

  it('should throw an error when creating a cast member with invalid data', async () => {
    await expect(usecase.execute({ name: 5 } as any)).rejects.toThrow(EntityValidationError);
  });
});
