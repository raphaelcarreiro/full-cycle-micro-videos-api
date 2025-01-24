import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-member/cast-member-providers';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import request from 'supertest';

describe('CastMemberController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const helper = startApp();

    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message: 'Category with id(s) 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a not found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('by id', async ({ id, expected }) => {
        const response = await request(helper.app.getHttpServer())
          .delete(`/cast-members/${id}`)
          .expect(expected.statusCode);

        expect(response.body).toStrictEqual(response.body);
      });
    });

    it('should delete a cast member response with status 204', async () => {
      const repository = helper.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );

      const castmember = CastMember.fake().aCastMember().build();
      await repository.insert(castmember);

      await request(helper.app.getHttpServer()).delete(`/cast-members/${castmember.cast_member_id.value}`).expect(204);

      await expect(repository.findById(castmember.cast_member_id)).resolves.toBeNull();
    });
  });
});
