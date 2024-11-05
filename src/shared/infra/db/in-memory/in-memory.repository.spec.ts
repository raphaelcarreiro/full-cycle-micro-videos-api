import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";

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
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.value,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository unit tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("should insert a new entity", async () => {
    const entity = new StubEntity({
      name: "Product 1",
      price: 10.5,
    });

    await repository.insert(entity);

    const result = await repository.findById(entity.entity_id);

    expect(result).toEqual(entity);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toEqual(entity);
  });

  it("should bulk insert", async () => {
    const entities = [
      new StubEntity({
        name: "Product 1",
        price: 10.5,
      }),

      new StubEntity({
        name: "Product 2",
        price: 20.5,
      }),
    ];

    await repository.bulkInsert(entities);

    expect(repository.items.length).toBe(2);
    expect(repository.items).toEqual(entities);
  });

  it("should return all items", async () => {
    const entities = [
      new StubEntity({
        name: "Product 1",
        price: 10.5,
      }),

      new StubEntity({
        name: "Product 2",
        price: 20.5,
      }),
    ];

    await repository.bulkInsert(entities);

    const result = await repository.findAll();

    expect(result).toEqual(entities);
  });

  it("should update an entity", async () => {
    const entity = new StubEntity({
      name: "Product 1",
      price: 10.5,
    });

    await repository.insert(entity);

    entity.name = "Product 2";
    entity.price = 20.5;

    await repository.update(entity);

    const result = await repository.findById(entity.entity_id);

    expect(result).toEqual(entity);
  });

  it("should delete an entity", async () => {
    const entity = new StubEntity({
      name: "Product 1",
      price: 10.5,
    });

    await repository.insert(entity);

    await repository.delete(entity.entity_id);

    const result = await repository.findById(entity.entity_id);

    expect(result).toBeNull();
  });

  it("should throw an error when entity was not found on delete operation", async () => {
    const entity = new StubEntity({
      name: "Product 1",
      price: 10.5,
    });

    await expect(repository.delete(entity.entity_id)).rejects.toThrow(
      NotFoundError
    );
  });

  it("should throw an error when entity was not found on update operation", async () => {
    const entity = new StubEntity({
      name: "Product 1",
      price: 10.5,
    });

    await expect(repository.update(entity)).rejects.toThrow(NotFoundError);
  });
});
