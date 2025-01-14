import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { CastMemberInMemoryRepository } from './cast-member-in-memory.repository';

describe('CastMemberInMemoryRepository tests', () => {
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
  });

  it('should not filter when filter is null', async () => {
    const items = [CastMember.fake().aCastMember().build()];

    const filtered = await repository['applyFilter'](items, null);

    expect(filtered).toStrictEqual(items);
  });

  it('should filter by name', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('raphael').build(),
      CastMember.fake().aCastMember().withName('jorge').build(),
      CastMember.fake().aCastMember().withName('camila').build(),
    ];

    const filtered = await repository['applyFilter'](items, 'camila');

    expect(filtered).toStrictEqual([items[2]]);
  });

  it('should sort by createdAt desc when sort props is null', async () => {
    const entitya = CastMember.fake().aCastMember().withCreatedAt(new Date('2024-11-15')).build();
    const entityb = CastMember.fake().aCastMember().withCreatedAt(new Date('2024-11-16')).build();
    const entityc = CastMember.fake().aCastMember().withCreatedAt(new Date('2024-11-17')).build();

    const items = [entitya, entityb, entityc];

    const filtered = repository['applySort'](items, null, null);

    expect(filtered).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name desc', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('susi').build(),
      CastMember.fake().aCastMember().withName('mayara').build(),
      CastMember.fake().aCastMember().withName('sara').build(),
    ];

    const filtered = repository['applySort'](items, 'name', 'desc');

    expect(filtered).toStrictEqual([items[0], items[2], items[1]]);
  });

  it('should sort by name asc', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('raphael').build(),
      CastMember.fake().aCastMember().withName('joao').build(),
      CastMember.fake().aCastMember().withName('silvio').build(),
    ];

    const filtered = repository['applySort'](items, 'name', 'asc');

    expect(filtered).toStrictEqual([items[1], items[0], items[2]]);
  });

  it('should sort desc when sortDir is null', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('manoel').build(),
      CastMember.fake().aCastMember().withName('ivete').build(),
      CastMember.fake().aCastMember().withName('ari').build(),
    ];

    const filtered = repository['applySort'](items, 'name', null);

    expect(filtered).toStrictEqual([items[0], items[1], items[2]]);
  });
});
