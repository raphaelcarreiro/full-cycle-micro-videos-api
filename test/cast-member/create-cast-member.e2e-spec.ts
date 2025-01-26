import request from 'supertest';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import { instanceToPlain } from 'class-transformer';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-member/cast-member-providers';
import { CreateCastMemberFixture } from 'src/nest-modules/cast-member/testing/cast-member.fixture';
import { CastMemberPresenter } from 'src/nest-modules/cast-member/cast-member.presenter';
import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';

describe('CastMemberController (e2e)', () => {
  const helper = startApp();

  let repository: ICastMemberRepository;

  beforeEach(async () => {
    repository = helper.app.get(CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide);
  });

  describe('/cast-members (POST)', () => {
    describe('should return response error on 422 status code when request body is invalid', () => {
      const fixture = CreateCastMemberFixture.arrangeInvalidRequest();

      const arrange = Object.keys(fixture).map(key => ({
        label: key,
        value: fixture[key],
      }));

      test.each(arrange)('when body is $label', async data => {
        await request(helper.app.getHttpServer())
          .post('/cast-members')
          .send(data.value.send_data)
          .expect(422)
          .expect(data.value.expected);
      });
    });

    describe('should return response error on 422 status code on entity validation', () => {
      const fixture = CreateCastMemberFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(fixture).map(key => ({
        label: key,
        value: fixture[key],
      }));

      test.each(arrange)('when body is $label', async data => {
        await request(helper.app.getHttpServer())
          .post('/cast-members')
          .send(data.value.send_data)
          .expect(422)
          .expect(data.value.expected);
      });
    });

    describe('should create a cast member', () => {
      const arrange = CreateCastMemberFixture.arrangeForCreate();

      test.each(arrange)('when body is $send_data', async data => {
        const response = await request(helper.app.getHttpServer()).post('/cast-members').send(data.send_data);

        const entity = await repository.findById(new CastMemberId(response.body.data.id));
        const presenter = instanceToPlain(new CastMemberPresenter(CastMemberOutputMapper.toOutput(entity)));

        expect(Object.keys(response.body.data)).toStrictEqual(CreateCastMemberFixture.keysInResponse);
        expect(response.body.data).toStrictEqual(presenter);
      });
    });
  });
});
