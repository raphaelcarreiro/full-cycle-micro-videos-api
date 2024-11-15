import { Category } from '../../domain/category.entity';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe('CategoryInMemoryRepository tests', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it('should not filter when filter is null', async () => {
    const items = [Category.create({ name: 'category a' })];

    const filtered = await repository['applyFilter'](items, null);

    expect(filtered).toStrictEqual(items);
  });

  it('should filter by name', async () => {
    const items = [
      new Category({ name: 'category a' }),
      new Category({ name: 'category b' }),
      new Category({ name: 'category c' }),
    ];

    const filtered = await repository['applyFilter'](items, 'category c');

    expect(filtered).toStrictEqual([items[2]]);
  });

  it('should sort by createdAt desc when sort props is null', async () => {
    const entitya = new Category({ name: 'category a', created_at: new Date('2024-11-15') });
    const entityb = new Category({ name: 'category b', created_at: new Date('2024-11-16') });
    const entityc = new Category({ name: 'category c', created_at: new Date('2024-11-17') });

    const items = [entitya, entityb, entityc];

    const filtered = repository['applySort'](items, null, null);

    expect(filtered).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name desc', async () => {
    const items = [
      new Category({ name: 'category a' }),
      new Category({ name: 'category b' }),
      new Category({ name: 'category c' }),
    ];

    const filtered = repository['applySort'](items, 'name', 'desc');

    expect(filtered).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name asc', async () => {
    const items = [
      new Category({ name: 'category b' }),
      new Category({ name: 'category a' }),
      new Category({ name: 'category c' }),
    ];

    const filtered = repository['applySort'](items, 'name', 'asc');

    expect(filtered).toStrictEqual([items[1], items[0], items[2]]);
  });

  it('should sort asc when sortDir is null', async () => {
    const items = [
      new Category({ name: 'category b' }),
      new Category({ name: 'category a' }),
      new Category({ name: 'category c' }),
    ];

    const filtered = repository['applySort'](items, 'name', null);

    expect(filtered).toStrictEqual([items[2], items[0], items[1]]);
  });
});
