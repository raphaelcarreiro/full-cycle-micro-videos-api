import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import { startApp } from 'src/nest-modules/shared/testing/helpers';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { UpdateCastMemberFixture } from 'src/nest-modules/cast-member/testing/cast-member.fixture';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-member/cast-member-providers';
import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { CastMemberPresenter } from 'src/nest-modules/cast-member/cast-member.presenter';

describe('CastMemberController (e2e)', () => {
  const helper = startApp();

  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('/cast-members/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const faker = CastMember.fake().aCastMember().build();

      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name, type: 1 },
          expected: {
            message: 'CastMember with id(s) 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a not found',
            statusCode: 404,
            error: 'Not found',
          },
        },
        {
          id: 'fake_id',
          send_data: { name: faker.name, type: 1 },
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, send_data, expected }) => {
        return request(helper.app.getHttpServer())
          .patch(`/cast-members/${id}`)
          .send(send_data)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    describe('should a response error on 422 status code when request body is invalid', () => {
      const invalidRequest = UpdateCastMemberFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map(key => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(helper.app.getHttpServer())
          .patch(`/cast-members/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with status code 422 when EntityValidationError', () => {
      const app = startApp();

      const validationError = UpdateCastMemberFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(validationError).map(key => ({
        label: key,
        value: validationError[key],
      }));

      let repository: ICastMemberRepository;

      beforeEach(() => {
        repository = app.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const castmember = CastMember.fake().aCastMember().build();

        await repository.insert(castmember);

        return request(app.app.getHttpServer())
          .patch(`/cast-members/${castmember.cast_member_id.value}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a category', () => {
      const arrange = UpdateCastMemberFixture.arrangeForUpdate();

      let repository: ICastMemberRepository;

      beforeEach(async () => {
        repository = helper.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $send_data', async ({ send_data, expected, entity: castmember }) => {
        await repository.insert(castmember);

        const response = await request(helper.app.getHttpServer())
          .patch(`/cast-members/${castmember.cast_member_id.value}`)
          .send(send_data)
          .expect(200);

        const updated = await repository.findById(new CastMemberId(response.body.data.id));

        const presenter = new CastMemberPresenter(CastMemberOutputMapper.toOutput(updated));
        const serialized = instanceToPlain(presenter);

        expect(Object.keys(response.body.data)).toStrictEqual(UpdateCastMemberFixture.keysInResponse);
        expect(response.body.data).toStrictEqual(serialized);
        expect(response.body.data).toStrictEqual({
          id: serialized.id,
          created_at: serialized.created_at,
          name: expected.name ?? updated.name,
          type: expected.type ?? updated.type,
        });
      });
    });
  });
});
