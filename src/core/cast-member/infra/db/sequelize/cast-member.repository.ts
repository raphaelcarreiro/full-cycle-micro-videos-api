import {
  CastMemberSearchParams,
  CastMemberSearchResult,
  ICastMemberRepository,
} from '@core/cast-member/domain/cast-member.repository.interface';
import { CastMemberModel } from './cast-member.model';
import { CastMember, CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberModelMapper } from './cast-member-model-mapper';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { WhereOptions } from 'sequelize';
import { Op } from 'sequelize';

export class CastMemberRepository implements ICastMemberRepository {
  sortableFields = ['name', 'type', 'created_at'];

  constructor(private readonly model: typeof CastMemberModel) {}

  async insert(entity: CastMember): Promise<void> {
    const model = CastMemberModelMapper.toModel(entity);
    await model.save();
  }

  async bulkInsert(entities: CastMember[]): Promise<void> {
    const models = entities.map(entity => CastMemberModelMapper.toModel(entity));
    await this.model.bulkCreate(models.map(model => model.toJSON()));
  }

  async update(entity: CastMember): Promise<void> {
    const model = await this._get(entity.cast_member_id.value);

    if (!model) {
      throw new NotFoundError(entity.cast_member_id.value, this.getEntity());
    }

    await this.model.update(
      {
        name: entity.name,
        type: entity.type,
      },
      {
        where: {
          cast_member_id: entity.cast_member_id.value,
        },
      },
    );
  }

  async delete(entityId: CastMemberId): Promise<void> {
    const model = await this._get(entityId.value);

    if (!model) {
      throw new NotFoundError(entityId.value, this.getEntity());
    }

    await this.model.destroy({
      where: {
        cast_member_id: entityId.value,
      },
    });
  }

  async findById(entityId: CastMemberId): Promise<CastMember | null> {
    const model = await this._get(entityId.value);

    if (!model) {
      return null;
    }

    return CastMemberModelMapper.toEntity(model);
  }

  async findAll(): Promise<CastMember[]> {
    const models = await this.model.findAll();

    return models.map(model => CastMemberModelMapper.toEntity(model));
  }

  async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const where = this.getSearchWhere(props);

    const { rows, count } = await this.model.findAndCountAll({
      where,
      order: [[props.sort ?? 'created_at', props.sort_direction ?? 'desc']],
      offset,
      limit: props.per_page,
    });

    return new CastMemberSearchResult({
      items: rows.map(row => CastMemberModelMapper.toEntity(row)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private getSearchWhere(props: CastMemberSearchParams): WhereOptions | undefined {
    const filter: WhereOptions = {};

    if (props.filter?.name) {
      filter.name = {
        [Op.like]: `%${props.filter.name}%`,
      };
    }

    if (props.filter?.type) {
      filter.type = props.filter.type;
    }

    return filter;
  }

  private async _get(id: string) {
    return await this.model.findByPk(id);
  }

  getEntity(): new (...args: any[]) => CastMember {
    return CastMember;
  }
}
