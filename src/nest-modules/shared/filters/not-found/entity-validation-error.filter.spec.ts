import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EntityValidationErrorFilter } from './entity-validation-error.filter';
import request from 'supertest';

@Controller('/stub')
class StubControler {
  @Get()
  index() {
    throw new EntityValidationError([
      'fake error',
      {
        field1: ['field1 is required', 'field1 must be a string'],
      },
      {
        field2: ['field2 is required'],
      },
    ]);
  }
}

describe('EntityValidationErrorFilter tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StubControler],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalFilters(new EntityValidationErrorFilter());

    await app.init();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: ['fake error', 'field1 is required', 'field1 must be a string', 'field2 is required'],
      });
  });
});
