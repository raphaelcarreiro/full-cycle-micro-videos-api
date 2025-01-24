import { CreateCastMemberUseCase } from '@core/cast-member/application/use-cases/create/create-cast-member.use-case';
import { DeleteCastMemberUseCase } from '@core/cast-member/application/use-cases/delete/delete-cast-member.use-case';
import { GetCastMembersUseCase } from '@core/cast-member/application/use-cases/list/get-cast-members.use-case';
import { GetCastMemberUseCase } from '@core/cast-member/application/use-cases/show/get-cast-member.use-case';
import { UpdateCastMemberUseCase } from '@core/cast-member/application/use-cases/update/update-cast-member.use-case';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { CastMemberRepository } from '@core/cast-member/infra/db/sequelize/cast-member.repository';
import { getModelToken } from '@nestjs/sequelize';

export const REPOSITORIES = {
  CAST_MEMBER_REPOSITORY: {
    provide: CastMemberRepository,
    useExisting: CastMemberRepository,
  },
  CAST_MEMBER_IN_MEMORY_REPOSITORY: {
    provide: CastMemberInMemoryRepository,
    useClass: CastMemberInMemoryRepository,
  },
  CAST_MEMBER_SEQUELIZE_REPOSITORY: {
    provide: CastMemberRepository,
    useFactory: (model: typeof CastMemberModel) => new CastMemberRepository(model),
    inject: [getModelToken(CastMemberModel)],
  },
};

export const USE_CASES = {
  CREATE_CATEGORY_USE_CASE: {
    provide: CreateCastMemberUseCase,
    useFactory: (repository: ICastMemberRepository) => new CreateCastMemberUseCase(repository),
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  UPDATE_CATEGORY_USE_CASE: {
    provide: UpdateCastMemberUseCase,
    useFactory: (repository: ICastMemberRepository) => new UpdateCastMemberUseCase(repository),
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  DELETE_CATEGORY_USE_CASE: {
    provide: DeleteCastMemberUseCase,
    useFactory: (repository: ICastMemberRepository) => new DeleteCastMemberUseCase(repository),
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  GET_CATEGORIES_USE_CASE: {
    provide: GetCastMembersUseCase,
    useFactory: (repository: ICastMemberRepository) => new GetCastMembersUseCase(repository),
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
  GET_CATEGORY_USE_CASE: {
    provide: GetCastMemberUseCase,
    useFactory: (repository: ICastMemberRepository) => new GetCastMemberUseCase(repository),
    inject: [REPOSITORIES.CAST_MEMBER_REPOSITORY.provide],
  },
};

export const CAST_MEMBER_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
