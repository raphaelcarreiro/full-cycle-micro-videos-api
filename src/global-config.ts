import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './nest-modules/shared/interceptors/wrapper-data/wrapper-data.interceptor';
import { Reflector } from '@nestjs/core';
import { EntityValidationErrorFilter } from './nest-modules/shared/filters/not-found/entity-validation-error.filter';
import { NotFoundFilter } from './nest-modules/shared/filters/not-found/not-found-error.filter';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      stopAtFirstError: false,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new WrapperDataInterceptor());

  app.useGlobalFilters(new NotFoundFilter(), new EntityValidationErrorFilter());
}
