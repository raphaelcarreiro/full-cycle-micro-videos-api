import { v4, validate } from "uuid";
import { ValueObject } from "../value-object";

export class Uuid extends ValueObject {
  readonly value: string;

  constructor(id?: string) {
    super();

    this.value = id || v4();

    this.validate();
  }

  private validate() {
    const isValid = validate(this.value);

    if (!isValid) {
      throw new InvalidUuidError();
    }
  }
}

export class InvalidUuidError extends Error {
  constructor(message?: string) {
    super(message || "Id must a valid UUID");
    this.name = "InvalidUuidError";
  }
}
