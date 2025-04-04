import { Chance } from 'chance';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from './category.aggregate';

type PropOrFactory<T> = T | ((index: number) => T);

export class CategoryFakeBuilder<TBuild = any> {
  private _category_id: PropOrFactory<Uuid> | undefined = undefined;
  private _name: PropOrFactory<string> = () => this.chance.word();
  private _description: PropOrFactory<string | null> = () => this.chance.paragraph();
  private _is_active: PropOrFactory<boolean> = () => true;
  private _created_at: PropOrFactory<Date> | undefined = undefined;

  private quantity: number;

  static aCategory() {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories(countObjs: number) {
    return new CategoryFakeBuilder<Category[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(quantity: number = 1) {
    this.quantity = quantity;
    this.chance = Chance();
  }

  withCategoryId(valueOrFactory: PropOrFactory<Uuid>) {
    this._category_id = valueOrFactory;
    return this;
  }

  withName(valueOrFactory: PropOrFactory<string>) {
    this._name = valueOrFactory;
    return this;
  }

  withDescription(valueOrFactory: PropOrFactory<string | null>) {
    this._description = valueOrFactory;
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
      const category = new Category({
        category_id: !this._category_id ? undefined : this.callFactory(this._category_id, index),
        name: this.callFactory(this._name, index),
        description: this.callFactory(this._description, index),
        is_active: this.callFactory(this._is_active, index),
        ...(this._created_at && {
          created_at: this.callFactory(this._created_at, index),
        }),
      });

      category.validate();

      return category;
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
