import { CastMemberType } from '@core/cast-member/domain/cast-member.aggregate';
import { IsEnum, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

type Payload = {
  id: string;
  name?: string;
  type?: number;
};

export class UpdateCastMemberInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEnum(CastMemberType)
  type?: number;

  @IsString()
  @IsNotEmpty()
  id: string;

  constructor(payload: Payload) {
    this.name = payload.name;
    this.type = payload.type;
    this.id = payload.id;
  }
}

export class ValidateCreateCategoryInput {
  static validate(payload: Payload) {
    validateSync(new UpdateCastMemberInput(payload));
  }
}
