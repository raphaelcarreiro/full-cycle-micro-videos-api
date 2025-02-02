import { Entity } from '../../../../domain/entity';
import { SearchParams } from '../../../../domain/repository/search-params';
import { SearchResult } from '../../../../domain/repository/search-result';
import { Uuid } from '../../../../domain/value-objects/uuid.vo';
import { SearchableInMemoryRepository } from '../searchable-in-memory.repository';

type StubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entity_id = props.entity_id ?? new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON(): { id: string } & StubEntityConstructorProps {
    return {
      id: this.entity_id.value,
      name: this.name,
      price: this.price,
    };
  }
}

class StubSearchableInMemoryRepository extends SearchableInMemoryRepository<StubEntity, Uuid> {
  sortableFields = ['name'];

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }

  async applyFilter(items: StubEntity[], filter: string): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter(
      item => item.name.toLowerCase().includes(filter.toLowerCase()) || item.price.toString() === filter,
    );
  }
}

describe('SearchableInMemoryRepository tests', () => {
  let repository: StubSearchableInMemoryRepository;

  beforeEach(() => {
    repository = new StubSearchableInMemoryRepository();
  });

  it('should filter', async () => {
    const entity1 = new StubEntity({ name: 'Raphael', price: 10.5 });
    const entity2 = new StubEntity({ name: 'Camila', price: 20 });

    const items = [entity1, entity2];

    const itemsFiltered = await repository.applyFilter(items, 'Raphael');

    expect(itemsFiltered).toStrictEqual([entity1]);
  });

  it('should response an empty array when filter value does not match any item', async () => {
    const entity1 = new StubEntity({ name: 'Raphael', price: 10.5 });
    const entity2 = new StubEntity({ name: 'Camila', price: 20 });

    const items = [entity1, entity2];

    const itemsFiltered = await repository.applyFilter(items, 'Jorge');

    expect(itemsFiltered).toStrictEqual([]);
  });

  it('should not filter when filter value is null', async () => {
    const entity1 = new StubEntity({ name: 'Raphael', price: 10.5 });
    const entity2 = new StubEntity({ name: 'Camila', price: 20 });

    const items = [entity1, entity2];

    const itemsFiltered = await repository.applyFilter(items, null);

    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should sort', async () => {
    const entity1 = new StubEntity({ name: 'Raphael', price: 10.5 });
    const entity2 = new StubEntity({ name: 'Camila', price: 20 });

    const items = [entity1, entity2];

    const sorted = repository['applySort'](items, null, null);

    expect(sorted).toStrictEqual([entity1, entity2]);
  });

  it('should sort by name and asc direction', async () => {
    const entity1 = new StubEntity({ name: 'Raphael', price: 10.5 });
    const entity2 = new StubEntity({ name: 'Camila', price: 20 });

    const items = [entity1, entity2];

    const sorted = repository['applySort'](items, 'name', 'asc');

    expect(sorted).toStrictEqual([entity2, entity1]);
  });

  it('should sort name asc direction when sortDir is null', async () => {
    const entity1 = new StubEntity({ name: 'Raphael', price: 10.5 });
    const entity2 = new StubEntity({ name: 'Camila', price: 20 });

    const items = [entity1, entity2];

    const sorted = repository['applySort'](items, 'name', null);

    expect(sorted).toStrictEqual([entity1, entity2]);
  });

  it('should paginate', async () => {
    const entity1 = new StubEntity({ name: 'Raphael', price: 10 });
    const entity2 = new StubEntity({ name: 'Camila', price: 12 });
    const entity3 = new StubEntity({ name: 'Jorge', price: 13 });
    const entity4 = new StubEntity({ name: 'Susi', price: 15 });
    const entity5 = new StubEntity({ name: 'Mayara', price: 16 });

    const items = [entity1, entity2, entity3, entity4, entity5];

    let paginated = repository['applyPaginate'](items, 1, 2);
    expect(paginated).toStrictEqual([entity1, entity2]);

    paginated = repository['applyPaginate'](items, 2, 3);
    expect(paginated).toStrictEqual([entity4, entity5]);

    paginated = repository['applyPaginate'](items, 3, 2);
    expect(paginated).toStrictEqual([entity5]);

    paginated = repository['applyPaginate'](items, 10, 2);
    expect(paginated).toStrictEqual([]);
  });

  it('should only apply pagination on search when params props are null', async () => {
    const entity = new StubEntity({ name: 'Raphael', price: 10 });

    repository.items = Array(16).fill(entity);

    const result = await repository.search(new SearchParams());

    expect(result).toStrictEqual(
      new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        current_page: 1,
        per_page: 15,
      }),
    );
  });

  it('should apply pagination and filter on search method', async () => {
    const entity = new StubEntity({ name: 'Raphael', price: 10 });

    repository.items = Array(16).fill(entity);

    const result = await repository.search(
      new SearchParams({
        filter: 'Raphael',
      }),
    );

    expect(result).toStrictEqual(
      new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        current_page: 1,
        per_page: 15,
      }),
    );
  });

  it('should apply pagination, filter and sort on search method', async () => {
    const items = [
      new StubEntity({ name: 'Raphael', price: 10 }),
      new StubEntity({ name: 'Jorge', price: 10 }),
      new StubEntity({ name: 'Susi', price: 10 }),
      new StubEntity({ name: 'Camila', price: 10 }),
      new StubEntity({ name: 'Mayara', price: 10 }),
    ];

    repository.items = items;

    const result = await repository.search(
      new SearchParams({
        filter: null,
        sort: 'name',
        sort_direction: 'asc',
      }),
    );

    expect(result).toStrictEqual(
      new SearchResult({
        items: [items[3], items[1], items[4], items[0], items[2]],
        total: 5,
        current_page: 1,
        per_page: 15,
      }),
    );
  });
});
