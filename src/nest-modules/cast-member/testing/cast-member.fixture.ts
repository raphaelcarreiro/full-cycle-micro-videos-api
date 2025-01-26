import { CastMember, CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';

const _keysInResponse = ['id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    const faker = CastMember.fake().aCastMember().withName('raphael');

    return [
      {
        send_data: {
          name: faker.name,
          type: CastMemberType.actor,
        },
        expected: {
          name: faker.name,
          type: CastMemberType.actor,
        },
      },
      {
        send_data: {
          name: faker.name,
          type: CastMemberType.director,
        },
        expected: {
          name: faker.name,
          type: CastMemberType.director,
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'type must be one of the following values: 1, 2',
          ],
          ...defaultExpected,
        },
      },
      UNDEFINED_NAME: {
        send_data: {
          name: undefined,
          type: 1,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      NULL_NAME: {
        send_data: {
          name: null,
          type: 1,
        },
        expected: {
          message: ['name should not be empty', 'name must be a string'],
          ...defaultExpected,
        },
      },
      EMPTY_NAME: {
        send_data: {
          name: '',
          type: 1,
        },
        expected: {
          message: ['name should not be empty'],
          ...defaultExpected,
        },
      },
      EMPTY_TYPE: {
        send_data: {
          name: 'name',
        },
        expected: {
          message: ['type must be one of the following values: 1, 2'],
          ...defaultExpected,
        },
      },
      INVALID_TYPE: {
        send_data: {
          name: 'name',
          type: 'invalid',
        },
        expected: {
          message: ['type must be one of the following values: 1, 2'],
          ...defaultExpected,
        },
      },
      NULL_TYPE: {
        send_data: {
          name: 'name',
          type: null,
        },
        expected: {
          message: ['type must be one of the following values: 1, 2'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().aCastMember();

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TOO_LONG_NAME: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
          type: 1,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateCastMemberFixture {
  static keysInResponse = _keysInResponse;

  static arrangeForUpdate() {
    const entity = CastMember.fake().aCastMember().build();

    return [
      {
        entity,
        send_data: {
          name: entity.name,
          type: 1,
        },
        expected: {
          name: entity.name,
          expected: 1,
        },
      },
      {
        entity,
        send_data: {
          name: entity.name,
          type: 2,
        },
        expected: {
          name: entity.name,
          type: 2,
        },
      },
      {
        entity,
        send_data: {
          type: 1,
        },
        expected: {
          name: entity.name,
          type: 1,
        },
      },
      {
        entity,
        send_data: {
          name: 'new name',
        },
        expected: {
          name: 'new name',
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      NAME_NOT_A_STRING: {
        send_data: {
          name: 5,
          type: 1,
        },
        expected: {
          message: ['name must be a string'],
          ...defaultExpected,
        },
      },
      TYPE_IS_NOT_ENUM: {
        send_data: {
          type: 'a',
          name: 'name',
        },
        expected: {
          message: ['type must be one of the following values: 1, 2'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = CastMember.fake().aCastMember();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TOO_LONG_NAME: {
        send_data: {
          name: faker.withInvalidNameTooLong().name,
          type: 1,
        },
        expected: {
          message: ['name must be shorter than or equal to 255 characters'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListCastMemberFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = CastMember.fake()
      .theCastMembers(4)
      .withName(i => i + '')
      .withCreatedAt(i => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third, entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = CastMember.fake().aCastMember();

    const entitiesMap = {
      mayara: faker.withName('mayara').withType(CastMemberType.actor).build(),
      carreiro: faker.withName('carreiro').withType(CastMemberType.director).build(),
      jorge: faker.withName('jorge').withType(CastMemberType.director).build(),
      susi: faker.withName('susi').withType(CastMemberType.actor).build(),
      camila: faker.withName('camila').withType(CastMemberType.actor).build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'car',
          type: 1,
        },
        expected: {
          entities: [entitiesMap.carreiro],
          meta: {
            total: 1,
            current_page: 1,
            last_page: 1,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 5,
          sort: 'name',
          filter: 'carreiro',
          type: 2,
        },
        expected: {
          entities: [],
          meta: {
            total: 0,
            current_page: 1,
            last_page: 0,
            per_page: 5,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          type: 2,
        },
        expected: {
          entities: [entitiesMap.camila, entitiesMap.mayara],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
