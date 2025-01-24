import { UpdateCastMemberInput } from '@core/cast-member/application/use-cases/update/update-cast-member.input';
import { OmitType } from '@nestjs/mapped-types';

class _UpdateCastMemberDto extends OmitType(UpdateCastMemberInput, ['id']) {}

export class UpdateCastMemberDto extends _UpdateCastMemberDto {}
