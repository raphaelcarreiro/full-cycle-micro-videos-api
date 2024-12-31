import { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not-found.error';
import { IRepository } from '../../../domain/repository/repository.interface';
import { ValueObject } from '../../../domain/value-object';

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject>
  implements IRepository<E, EntityId>
{
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const item = await this.findById(entity.entity_id);

    if (!item) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }

    this.items = this.items.map(item => {
      if (item.entity_id.equals(entity.entity_id)) {
        return entity;
      }

      return item;
    });
  }

  async delete(entityId: EntityId): Promise<void> {
    const item = await this.findById(entityId);

    if (!item) {
      throw new NotFoundError(entityId, this.getEntity());
    }

    this.items = this.items.filter(item => !item.entity_id.equals(entityId));
  }

  async findById(entityId: EntityId | ValueObject): Promise<E | null> {
    const item = this.items.find(item => item.entity_id.equals(entityId));

    if (!item) {
      return null;
    }

    return item;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

  abstract getEntity(): new (...args: any[]) => E;
}
