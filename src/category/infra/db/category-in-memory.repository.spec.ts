import { Category } from '../../domain/category.entity';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe('CategoryInMemoryRepository tests', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  it('should not filter when filter is null', async () => {
    const items = [Category.fake().aCategory().build()];

    const filtered = await repository['applyFilter'](items, null);

    expect(filtered).toStrictEqual(items);
  });

  it('should filter by name', async () => {
    const items = [
      Category.fake().aCategory().withName('category a').build(),
      Category.fake().aCategory().withName('category b').build(),
      Category.fake().aCategory().withName('category c').build(),
    ];

    const filtered = await repository['applyFilter'](items, 'category c');

    expect(filtered).toStrictEqual([items[2]]);
  });

  it('should sort by createdAt desc when sort props is null', async () => {
    const entitya = Category.fake().aCategory().withCreatedAt(new Date('2024-11-15')).build();
    const entityb = Category.fake().aCategory().withCreatedAt(new Date('2024-11-16')).build();
    const entityc = Category.fake().aCategory().withCreatedAt(new Date('2024-11-17')).build();

    const items = [entitya, entityb, entityc];

    const filtered = repository['applySort'](items, null, null);

    expect(filtered).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name desc', async () => {
    const items = [
      Category.fake().aCategory().withName('category a').build(),
      Category.fake().aCategory().withName('category b').build(),
      Category.fake().aCategory().withName('category c').build(),
    ];

    const filtered = repository['applySort'](items, 'name', 'desc');

    expect(filtered).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name asc', async () => {
    const items = [
      Category.fake().aCategory().withName('category b').build(),
      Category.fake().aCategory().withName('category a').build(),
      Category.fake().aCategory().withName('category c').build(),
    ];

    const filtered = repository['applySort'](items, 'name', 'asc');

    expect(filtered).toStrictEqual([items[1], items[0], items[2]]);
  });

  it('should sort asc when sortDir is null', async () => {
    const items = [
      Category.fake().aCategory().withName('category b').build(),
      Category.fake().aCategory().withName('category a').build(),
      Category.fake().aCategory().withName('category c').build(),
    ];

    const filtered = repository['applySort'](items, 'name', null);

    expect(filtered).toStrictEqual([items[2], items[0], items[1]]);
  });
});
