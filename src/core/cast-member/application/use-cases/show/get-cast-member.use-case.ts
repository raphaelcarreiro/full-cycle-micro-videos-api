import { IUseCase } from '@core/shared/application/use-case-interface';
import { CastMemberOutput, CastMemberOutputMapper } from '../common/cast-member-output';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.entity';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

type Input = {
  id: string;
};

type Output = CastMemberOutput;

export class GetCastMemberUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICastMemberRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.find(input.id);

    return CastMemberOutputMapper.toOutput(category);
  }

  private async find(id: string) {
    const category = await this.repository.findById(new CastMemberId(id));

    if (!category) {
      throw new NotFoundError(id, CastMember);
    }

    return category;
  }
}
