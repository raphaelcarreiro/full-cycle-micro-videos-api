import { InvalidUuidError, Uuid } from '../uuid.vo';

describe('uuid value object unit tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  it('should throw an error when uuid is invalid', () => {
    expect(() => new Uuid('invalid-uuid')).toThrow(InvalidUuidError);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should create a valid uuid value object', () => {
    const uuid = new Uuid();

    expect(uuid.value).toBeDefined();
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should create a valid uuid value object from a existing value', () => {
    const uuid = new Uuid('60c28a53-e438-418a-b153-320a072efaad');

    expect(uuid.value).toBe('60c28a53-e438-418a-b153-320a072efaad');
    expect(validateSpy).toHaveBeenCalled();
  });
});
