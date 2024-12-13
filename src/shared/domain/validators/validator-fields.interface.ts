import { Notification } from '../../validators/notification';

export type FieldsErrors =
  | {
      [key: string]: string[];
    }
  | string;

export interface IValidatorFields {
  validate(notification: Notification, data: any, fields: string[]): boolean;
}
