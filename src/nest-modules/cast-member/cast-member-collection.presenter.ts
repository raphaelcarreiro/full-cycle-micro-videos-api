import { PaginationOutput } from '@core/shared/application/pagination-output';
import { CollectionPresenter } from '../shared/collection.presenter';
import { CastMemberPresenter } from './cast-member.presenter';
import { CastMemberOutput } from '@core/cast-member/application/use-cases/common/cast-member-output';

export class CastMemberCollectionPresenter extends CollectionPresenter {
  data: CastMemberPresenter[];

  constructor({ items, ...props }: PaginationOutput<CastMemberOutput>) {
    super(props);
    this.data = items.map(item => new CastMemberPresenter(item));
  }
}
