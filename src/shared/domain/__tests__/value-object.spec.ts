import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(public readonly prop1: number, public readonly prop2: number) {
    super();
  }
}

describe("value object unit tests", () => {
  it("should compare and get falsy", () => {
    const first = new StringValueObject("Raphael");
    const second = new StringValueObject("Carreiro");

    first.equals(second);

    expect(first.equals(second)).toBeFalsy();
  });

  it("should compare and get truthy", () => {
    const first = new ComplexValueObject(1, 1);
    const second = new ComplexValueObject(1, 1);

    first.equals(second);

    expect(first.equals(second)).toBeTruthy();
  });
});
