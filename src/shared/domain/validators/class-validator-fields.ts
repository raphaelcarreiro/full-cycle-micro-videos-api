import { validateSync, ValidationError } from 'class-validator';
import { FieldsErrors, IValidatorFields } from './validator-fields.interface';
import { Notification } from '../../validators/notification';

export abstract class ClassValidatorFields implements IValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean {
    const errors = validateSync(data, {
      groups: fields,
    });

    if (errors.length) {
      for (const error of errors) {
        this.add(notification, error);
      }
    }

    return !errors.length;
  }

  private add(notification: Notification, error: ValidationError) {
    const field = error.property;

    Object.values(error.constraints!).forEach(message => notification.add(message, field));
  }
}
