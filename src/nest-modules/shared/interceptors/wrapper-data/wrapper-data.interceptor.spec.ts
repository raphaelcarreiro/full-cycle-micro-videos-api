import { lastValueFrom, of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should transform response', async () => {
    const obs$ = interceptor.intercept(null, {
      handle: () => of({ name: 'test' }),
    });

    const response = await lastValueFrom(obs$);

    expect(response).toStrictEqual({
      data: {
        name: 'test',
      },
    });
  });

  it('should transform response', async () => {
    const data = {
      data: {
        name: 'test',
      },
      meta: {
        total: 1,
      },
    };

    const obs$ = interceptor.intercept(null, {
      handle: () => of(data),
    });

    const response = await lastValueFrom(obs$);

    expect(response).toStrictEqual(data);
  });
});
