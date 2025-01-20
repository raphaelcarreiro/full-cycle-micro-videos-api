import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';

describe('CreateCastMemberUseCase Unit Tests', () => {
  let usecase: CreateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    usecase = new CreateCastMemberUseCase(repository);
  });

  it('should create a cast member', async () => {
    const input = {
      name: 'name',
      type: 1,
    };

    const insertSpy = jest.spyOn(repository, 'insert');
    const output = await usecase.execute(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.type).toBe(input.type);
    expect(output.created_at).toBeInstanceOf(Date);
    expect(insertSpy).toHaveBeenCalled();
  });
});
