import { ClassValidatorFields } from '@core/shared/domain/validators/class-validator-fields';
import { CastMemberValidationRules } from './cast-member-validation-rules';
import { Notification } from '@core/shared/domain/validators/notification';

export class CastMemberValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const _fields = fields?.length ? fields : ['name'];
    return super.validate(notification, new CastMemberValidationRules(data), _fields);
  }
}
