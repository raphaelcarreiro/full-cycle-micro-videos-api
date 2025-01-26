import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { instanceToPlain } from 'class-transformer';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-member/cast-member-providers';
import { CastMemberPresenter } from 'src/nest-modules/cast-member/cast-member.presenter';
import { ListCastMemberFixture } from 'src/nest-modules/cast-member/testing/cast-member.fixture';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import request from 'supertest';

describe('CastMemberController (e2e)', () => {
  describe('should return categories sorted by created_at when query params are not provided', () => {
    const helper = startApp();
    let repository: ICastMemberRepository;

    const { arrange, entitiesMap } = ListCastMemberFixture.arrangeIncrementedWithCreatedAt();

    beforeEach(async () => {
      repository = helper.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );

      await repository.bulkInsert(Object.values(entitiesMap));
    });

    test.each(arrange)('when query params is $send_data', async ({ send_data, expected }) => {
      const query = new URLSearchParams(send_data as any).toString();

      await request(helper.app.getHttpServer())
        .get('/cast-members')
        .query(query)
        .expect(200)
        .expect({
          data: expected.entities.map(entity =>
            instanceToPlain(new CastMemberPresenter(CastMemberOutputMapper.toOutput(entity))),
          ),
          meta: expected.meta,
        });
    });
  });

  describe('should return categories using paginate, filter and sort', () => {
    const helper = startApp();
    let repository: ICastMemberRepository;

    const { arrange, entitiesMap } = ListCastMemberFixture.arrangeUnsorted();

    beforeEach(async () => {
      repository = helper.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );

      await repository.bulkInsert(Object.values(entitiesMap));
    });

    test.each(arrange)('when query params is $send_data', async ({ send_data, expected }) => {
      const query = new URLSearchParams(send_data as any).toString();

      await request(helper.app.getHttpServer())
        .get('/cast-members')
        .query(query)
        .expect(200)
        .expect({
          data: expected.entities.map(entity =>
            instanceToPlain(new CastMemberPresenter(CastMemberOutputMapper.toOutput(entity))),
          ),
          meta: expected.meta,
        });
    });
  });
});
