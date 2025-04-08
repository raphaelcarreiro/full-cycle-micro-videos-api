import { CategoryId } from '@core/category/domain/category.aggregate';
import { ISearchableRepository } from '../../shared/domain/repository/repository.interface';
import { SearchParams, SearchParamsConstructorProps } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Genre } from './genre.aggregate';

export type GenreFilter = {
  name?: string;
  category_ids?: CategoryId[] | string[];
};

export class GenreSearchParams extends SearchParams<GenreFilter> {
  constructor(props?: SearchParamsConstructorProps<GenreFilter>) {
    super(props);

    const categoryIds = props?.filter?.category_ids?.map(id => {
      return id instanceof CategoryId ? id : new CategoryId(id);
    });

    this.filter = {
      name: props?.filter?.name,
      category_ids: categoryIds,
    };
  }

  get filter() {
    return this._filter;
  }

  set filter(value: GenreFilter | null) {
    const _value = !value || typeof value !== 'object' ? null : value;

    const filter = {
      name: _value?.name ?? `${value?.name}`,
      category_ids: _value?.category_ids,
    };

    this._filter = Object.values(filter).every(item => !!item) ? filter : null;
  }
}

export class GenreSearchResult extends SearchResult<Genre> {}

export interface IGenreRepository
  extends ISearchableRepository<Genre, Uuid, GenreFilter, GenreSearchParams, GenreSearchResult> {}
