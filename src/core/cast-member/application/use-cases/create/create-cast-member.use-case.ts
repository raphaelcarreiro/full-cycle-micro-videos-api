import { IUseCase } from '@core/shared/application/use-case-interface';
import { CastMemberOutput, CastMemberOutputMapper } from '../common/cast-member-output';
import { CreateCastMemberInput } from './create-cast-member.input';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';

type Input = CreateCastMemberInput;

type Output = CastMemberOutput;

export class CreateCastMemberUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICastMemberRepository) {}

  async execute(input: Input): Promise<Output> {
    const castMember = CastMember.create({
      name: input.name,
      type: input.type,
    });

    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON());
    }

    await this.repository.insert(castMember);

    return CastMemberOutputMapper.toOutput(castMember);
  }
}
