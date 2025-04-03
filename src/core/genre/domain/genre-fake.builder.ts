import { Chance } from 'chance';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Genre } from './genre.aggregate';
import { CategoryId } from '@core/category/domain/category.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);

export class GenreFakeBuilder<TBuild = any> {
  private _genre_id: PropOrFactory<Uuid> | undefined = undefined;
  private _category_ids: PropOrFactory<CategoryId[]>[] = [];
  private _name: PropOrFactory<string> = () => this.chance.word();
  private _is_active: PropOrFactory<boolean> = () => true;
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private quantity: number;

  static aGenre() {
    return new GenreFakeBuilder<Genre>();
  }

  static theGenres(quantity: number) {
    return new GenreFakeBuilder<Genre[]>(quantity);
  }

  private chance: Chance.Chance;

  private constructor(quantity: number = 1) {
    this.quantity = quantity;
    this.chance = Chance();
  }

  withGenreId(valueOrFactory: PropOrFactory<Uuid>) {
    this._genre_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  addCategoryId(valueOrFactory: PropOrFactory<CategoryId[]>) {
    this._category_ids.push(valueOrFactory);
    return this;
  }

  activate() {
    this._is_active = true;
    return this;
  }

  deactivate() {
    this._is_active = false;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._created_at = valueOrFactory;
    return this;
  }

  withInvalidNameTooLong(value?: string) {
    this._name = value ?? this.chance.word({ length: 256 });
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.quantity).fill(undefined).map((_, index) => {
      const categoryId = new CategoryId();

      const categoryIds = this._category_ids.length ? this.callFactory(this._category_ids, index) : [categoryId];

      const genre = new Genre({
        genre_id: !this._genre_id ? undefined : this.callFactory(this._genre_id, index),
        name: this.callFactory(this._name, index),
        category_ids: new Map(categoryIds.map(category_id => [category_id.value, category_id])),
        is_active: this.callFactory(this._is_active, index),
        created_at: this.callFactory(this._created_at, index),
      });

      genre.validate();

      return genre;
    });

    return this.quantity === 1 ? (categories[0] as TBuild) : (categories as TBuild);
  }

  get category_id() {
    return this.getValue('category_id');
  }

  get name() {
    return this.getValue('name');
  }

  get description() {
    return this.getValue('description');
  }

  get is_active() {
    return this.getValue('is_active');
  }

  get created_at() {
    return this.getValue('created_at');
  }

  private getValue(prop: any) {
    const optional = ['category_id', 'created_at'];
    const privateProp = `_${prop}` as keyof this;

    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(`Property ${prop} not have a factory, use 'with' methods`);
    }

    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function' ? factoryOrValue(index) : factoryOrValue;
  }
}
