import { Entity } from '@core/shared/domain/entity';
import { NotFoundFilter } from './not-found-error.filter';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Test } from '@nestjs/testing';
import request from 'supertest';

class StubEntity extends Entity {
  entity_id: any;

  toJSON() {
    return {};
  }
}

@Controller('/stub')
class StubController {
  @Get()
  index() {
    throw new NotFoundError('FAKE_ID', StubEntity);
  }
}

describe('NotFoundFilter', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new NotFoundFilter());
    await app.init();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer()).get('/stub').expect(404).expect({
      statusCode: 404,
      error: 'Not found',
      message: 'StubEntity with id(s) FAKE_ID not found',
    });
  });
});
