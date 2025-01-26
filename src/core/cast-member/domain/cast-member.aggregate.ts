import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMemberValidator } from './validation/cast-member.validator';
import { CastMemberFakeBuilder } from './cast-member-fake.builder';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';

export type CastMemberConstructorProps = {
  cast_member_id?: CastMemberId;
  name: string;
  type: CastMemberType;
  created_at?: Date;
};

export type CastMemberCreateProps = {
  name: string;
  type: CastMemberType;
};

export enum CastMemberType {
  director = 1,
  actor = 2,
}

export class CastMemberId extends Uuid {}

export class CastMember extends AggregateRoot {
  cast_member_id: CastMemberId;
  name: string;
  type: CastMemberType;
  created_at: Date;

  constructor(props: CastMemberConstructorProps) {
    super();

    this.cast_member_id = props.cast_member_id ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type;
    this.created_at = props.created_at ?? new Date();
  }

  static create(props: CastMemberCreateProps) {
    const castMember = new CastMember({
      cast_member_id: new CastMemberId(),
      name: props.name,
      type: props.type,
      created_at: new Date(),
    });

    castMember.validate(['name']);

    return castMember;
  }

  changeName(name: string) {
    this.name = name;

    this.validate(['name']);

    return this;
  }

  changeType(type: CastMemberType) {
    this.type = type;
    return this;
  }

  validate(fields?: string[]) {
    const validator = new CastMemberValidator();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  get entity_id(): CastMemberId {
    return this.cast_member_id;
  }

  toJSON() {
    return {
      cast_member_id: this.entity_id.value,
      name: this.name,
      type: this.type,
      created_at: this.created_at,
    };
  }
}
