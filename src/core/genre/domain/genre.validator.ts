import { MaxLength } from 'class-validator';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-fields';
import { Notification } from '../../shared/domain/validators/notification';
import { Genre } from './genre.aggregate';

export class GenreRules {
  @MaxLength(255, {
    groups: ['name'],
  })
  name: string;

  constructor(genre: Genre) {
    Object.assign(this, genre);
  }
}

export class GenreValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const _fields = fields?.length ? fields : ['name'];
    return super.validate(notification, new GenreRules(data), _fields);
  }
}

export class GenreValidatorFactory {
  static create() {
    return new GenreValidator();
  }
}
