export class Notification {
  errors = new Map<string, string[]>();

  add(error: string, field?: string) {
    if (field) {
      this.addWithField(error, field);
    } else {
      this.errors.set(error, [error]);
    }
  }

  private addWithField(error: string, field: string) {
    if (!this.errors.has(field)) {
      this.errors.set(field, [error]);
      return;
    }

    const errors = this.errors.get(field) as string[];
    errors.push(error);
    this.errors.set(field, errors);
  }

  set(error: string | string[], field?: string) {
    if (field) {
      this.errors.set(field, Array.isArray(error) ? error : [error]);
      return;
    }

    if (Array.isArray(error)) {
      error.forEach(value => this.errors.set(value, [value]));
      return;
    }

    this.errors.set(error, [error]);
  }

  hasErrors(): boolean {
    return this.errors.size > 0;
  }

  copy(notification: Notification) {
    notification.errors.forEach((value, field) => this.set(value, field));
  }

  toJSON() {
    const errors: Array<string | { [key: string]: string[] }> = [];

    this.errors.forEach((value, key) => {
      if (typeof value === 'string') {
        errors.push(value);
      } else {
        errors.push({ [key]: value });
      }
    });

    return errors;
  }
}
