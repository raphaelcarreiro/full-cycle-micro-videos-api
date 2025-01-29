import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';

export class GenreId extends Uuid {}

export class Genre extends AggregateRoot {
  genre_id: GenreId;
  name: string;
  is_active: boolean;
  created_at: Date;

  get entity_id() {
    return this.genre_id;
  }

  toJSON() {
    return {
      genre_id: this.genre_id.value,
      name: this.name,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
