import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { instanceToPlain } from 'class-transformer';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-member/cast-member-providers';
import { CastMemberPresenter } from 'src/nest-modules/cast-member/cast-member.presenter';
import { GetCastMemberFixture } from 'src/nest-modules/cast-member/testing/cast-member.fixture';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import request from 'supertest';

describe('CastMemberController (e2e)', () => {
  const helper = startApp();

  const arrange = [
    {
      id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
      expected: {
        message: 'CastMember with id(s) 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a not found',
        statusCode: 404,
        error: 'Not found',
      },
    },
    {
      id: 'fake_id',
      expected: {
        message: 'Validation failed (uuid is expected)',
        statusCode: 422,
        error: 'Unprocessable Entity',
      },
    },
  ];

  test.each(arrange)('by id', async ({ id, expected }) => {
    const response = await request(helper.app.getHttpServer()).get(`/cast-members/${id}`).expect(expected.statusCode);

    expect(response.body).toStrictEqual(expected);
  });

  it('should get a cast member', async () => {
    const repository = helper.app.get(CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide);

    const castmember = CastMember.fake().aCastMember().build();
    await repository.insert(castmember);

    const response = await request(helper.app.getHttpServer())
      .get(`/cast-members/${castmember.cast_member_id.value}`)
      .expect(200);

    const presenter = new CastMemberPresenter(CastMemberOutputMapper.toOutput(castmember));
    const serilized = instanceToPlain(presenter);

    expect(response.body.data).toStrictEqual(serilized);
    expect(Object.keys(response.body.data)).toStrictEqual(GetCastMemberFixture.keysInResponse);
  });
});
