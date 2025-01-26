import { MaxLength } from 'class-validator';
import { CastMember } from '../cast-member.aggregate';

export class CastMemberValidationRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(castMember: CastMember) {
    Object.assign(this, castMember);
  }
}
