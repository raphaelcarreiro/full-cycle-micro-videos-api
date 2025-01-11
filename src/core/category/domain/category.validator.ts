import { IsNumber, IsString, Max, MaxLength } from 'class-validator';
import { Category } from './category.aggregate';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/validators/notification';

export class CategoryRules {
  @MaxLength(255, {
    groups: ['name'],
  })
  name: string;

  constructor(category: Category) {
    Object.assign(this, category);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const _fields = fields?.length ? fields : ['name'];
    return super.validate(notification, new CategoryRules(data), _fields);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
