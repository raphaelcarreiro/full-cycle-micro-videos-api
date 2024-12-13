import { IsNumber, IsString, Max, MaxLength } from 'class-validator';
import { Category } from './category.entity';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/validators/notification';
import { plainToClass, plainToInstance } from 'class-transformer';

export class CategoryRules {
  @MaxLength(255, {
    groups: ['name'],
  })
  name: string;

  constructor(category: Category) {
    Object.assign(this, plainToInstance(CategoryRules, category));
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const _fields = fields.length ? fields : ['name'];
    return super.validate(notification, new CategoryRules(data), _fields);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
