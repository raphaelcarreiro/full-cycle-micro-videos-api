import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository.interface';
import { IUseCase } from '@core/shared/application/use-case-interface';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

type Input = {
  id: string;
};

type Output = void;

export class DeleteCastMemberUseCase implements IUseCase<Input, Output> {
  constructor(private readonly repository: ICastMemberRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.find(input.id);

    await this.repository.delete(category.cast_member_id);
  }

  private async find(id: string) {
    const category = await this.repository.findById(new CastMemberId(id));

    if (!category) {
      throw new NotFoundError(id, CastMember);
    }

    return category;
  }
}
