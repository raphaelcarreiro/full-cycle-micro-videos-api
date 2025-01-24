import { CastMemberOutput } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { Transform } from 'class-transformer';

export class CastMemberPresenter {
  id: string;
  name: string;
  type: number;
  @Transform(({ value }) => value.toISOString())
  created_at: Date;

  constructor(output: CastMemberOutput) {
    this.id = output.id;
    this.name = output.name;
    this.type = output.type;
    this.created_at = output.created_at;
  }
}
