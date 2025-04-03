import { CategoryId } from '@core/category/domain/category.aggregate';
import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { GenreValidatorFactory } from './genre.validator';

export type GenreConstructorProps = {
  genre_id: GenreId;
  name: string;
  category_ids: Map<string, CategoryId>;
  is_active: boolean;
  created_at: Date;
};

export type GenreCreateCommandProps = {
  name: string;
  category_ids: CategoryId[];
  is_active?: boolean;
};

export class GenreId extends Uuid {}

export class Genre extends AggregateRoot {
  genre_id: GenreId;
  name: string;
  is_active: boolean;
  created_at: Date;
  category_ids: Map<string, CategoryId>;

  constructor(props: GenreConstructorProps) {
    super();
    this.genre_id = props.genre_id ?? new GenreId(props.genre_id);
    this.name = props.name;
    this.category_ids = props.category_ids;
    this.is_active = props.is_active;
    this.created_at = props.created_at;
  }

  static create(props: GenreCreateCommandProps): Genre {
    const genre = new Genre({
      genre_id: new GenreId(),
      category_ids: new Map(props.category_ids.map(category_id => [category_id.value, category_id])),
      name: props.name,
      is_active: props.is_active ?? true,
      created_at: new Date(),
    });

    genre.validate(['name']);

    return genre;
  }

  validate(fields?: string[]) {
    const validator = GenreValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  activate() {
    this.is_active = true;
  }

  deactivate() {
    this.is_active = false;
  }

  addCategoryId(category_id: CategoryId): void {
    this.category_ids.set(category_id.value, category_id);
  }

  removeCategoryId(category_id: CategoryId): void {
    this.category_ids.delete(category_id.value);
  }

  syncCategoryIds(category_ids: CategoryId[]): void {
    if (!category_ids.length) {
      return;
    }

    this.category_ids = new Map(category_ids.map(category_id => [category_id.value, category_id]));
  }

  get entity_id() {
    return this.genre_id;
  }

  toJSON() {
    return {
      genre_id: this.genre_id.value,
      category_ids: Array.from(this.category_ids.values()).map(category_id => category_id.value),
      name: this.name,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }
}
