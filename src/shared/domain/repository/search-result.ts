import { Entity } from '../entity';
import { ValueObject } from '../value-object';

type SearchResultProps<E extends Entity> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
};

export class SearchResult<E extends Entity = Entity> extends ValueObject {
  readonly items: E[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;

  constructor(props: SearchResultProps<E>) {
    super();
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(props.total / props.per_page);
  }

  toJSON(options: { forceEntity: boolean } = { forceEntity: false }) {
    return {
      items: options.forceEntity ? this.entitiesToJSON(this.items) : this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
    };
  }

  entitiesToJSON(entities: Entity[]) {
    return entities.map(entity => entity.toJSON());
  }
}
