import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { IsEnum, IsNotEmpty, IsString, validateSync } from 'class-validator';

type Payload = {
  name: string;
  type: CastMemberType;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CastMemberType)
  type: CastMemberType;

  constructor(payload: Payload) {
    this.name = payload?.name;
    this.type = payload?.type;
  }
}

export class ValidateCreateCategoryInput {
  static validate(payload: Payload) {
    validateSync(new CreateCastMemberInput(payload));
  }
}
