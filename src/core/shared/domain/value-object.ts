import isEqual from 'lodash/isEqual';

export abstract class ValueObject {
  public equals(value?: this): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (value.constructor !== this.constructor) {
      return false;
    }

    return isEqual(value, this);
  }
}
