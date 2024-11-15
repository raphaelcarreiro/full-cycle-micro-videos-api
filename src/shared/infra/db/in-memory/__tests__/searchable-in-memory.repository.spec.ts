import { Entity } from '../../../../domain/entity';
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

    const itemsFiltered = await repository['applySort'](items, null, 'asc');

    expect(itemsFiltered).toStrictEqual([entity2, entity1]);
  });
});
