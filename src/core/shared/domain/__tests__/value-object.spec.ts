import { ValueObject } from '../value-object';

class StringValueObject extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(
    public readonly prop1: number,
    public readonly prop2: number,
  ) {
    super();
  }
}

describe('value object unit tests', () => {
  it('should compare and get falsy', () => {
    const first = new StringValueObject('Raphael');
    const second = new StringValueObject('Carreiro');

    expect(first.equals(second)).toBeFalsy();
  });

  it('should compare and get truthy', () => {
    const first = new ComplexValueObject(1, 1);
    const second = new ComplexValueObject(1, 1);

    expect(first.equals(second)).toBeTruthy();
  });

  it('should compare and get false when equals method received null as parameter value', () => {
    const first = new StringValueObject('Raphael');

    expect(first.equals(null)).toBeFalsy();
  });

  it('should compare and get false when equals method received undefined as parameter value', () => {
    const first = new StringValueObject('Raphael');

    expect(first.equals(undefined)).toBeFalsy();
  });

  it('should compare and get false when vo are differents', () => {
    const first = new StringValueObject('Raphael');
    const second = new ComplexValueObject(1, 1);

    expect(first.equals(second as any)).toBeFalsy();
  });
});
