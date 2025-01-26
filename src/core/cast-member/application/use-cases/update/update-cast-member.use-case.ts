import { IUseCase } from '@core/shared/application/use-case-interface';
import { CastMemberOutput, CastMemberOutputMapper } from '../common/cast-member-output';
import { UpdateCastMemberInput } from './update-cast-member.input';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

type Input = UpdateCastMemberInput;

type Output = CastMemberOutput;

export class UpdateCastMemberUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICastMemberRepository) {}

  async execute(input: Input): Promise<Output> {
    const castmember = await this.find(input.id);

    const changed = this.change(castmember, input);

    if (castmember.notification.hasErrors()) {
      throw new EntityValidationError(castmember.notification.toJSON());
    }

    await this.repository.update(changed);

    return CastMemberOutputMapper.toOutput(changed);
  }

  private change(castmember: CastMember, input: Input): CastMember {
    const map = {
      name: () => castmember.changeName(input.name),
      type: () => castmember.changeType(input.type),
    };

    Object.keys(input).forEach(key => {
      if (key in map) {
        map[key as keyof typeof map]();
      }
    });

    return castmember;
  }

  private async find(id: string) {
    const castmember = await this.repository.findById(new CastMemberId(id));

    if (!castmember) {
      throw new NotFoundError(id, CastMember);
    }

    return castmember;
  }
}
