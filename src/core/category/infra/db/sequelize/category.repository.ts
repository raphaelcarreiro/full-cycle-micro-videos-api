import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.aggregate';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../../domain/category.repository.interface';
import { CategoryModel } from './category.model';
import { WhereOptions } from 'sequelize';
import { CategoryModelMapper } from './category-model-mapper';

export class CategoryRepository implements ICategoryRepository {
  sortableFields = ['name', 'created_at'];

  constructor(private readonly model: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    const category = CategoryModelMapper.toModel(entity);

    await category.save();
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    const categories = entities.map(entity => CategoryModelMapper.toModel(entity));

    await this.model.bulkCreate(categories.map(category => category.toJSON()));
  }

  async update(entity: Category): Promise<void> {
    const category = await this._get(entity.category_id.value);

    if (!category) {
      throw new NotFoundError(entity.category_id.value, this.getEntity());
    }

    await this.model.update(
      {
        name: entity.name,
        is_active: entity.is_active,
        description: entity.description,
      },
      {
        where: {
          category_id: entity.category_id.value,
        },
      },
    );
  }

  async delete(entityId: Uuid): Promise<void> {
    const category = await this._get(entityId.value);

    if (!category) {
      throw new NotFoundError(entityId.value, this.getEntity());
    }

    await this.model.destroy({
      where: {
        category_id: entityId.value,
      },
    });
  }

  async findById(entityId: Uuid): Promise<Category | null> {
    const category = await this._get(entityId.value);

    if (!category) {
      return null;
    }

    return CategoryModelMapper.toEntity(category);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.model.findAll();

    return categories.map(category => CategoryModelMapper.toEntity(category));
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const where = this.getSearchWhere(props);

    const { rows, count } = await this.model.findAndCountAll({
      where,
      order: [[props.sort ?? 'created_at', props.sort_direction ?? 'desc']],
      offset,
      limit: props.per_page,
    });

    return new CategorySearchResult({
      items: rows.map(row => CategoryModelMapper.toEntity(row)),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private getSearchWhere(props: CategorySearchParams): WhereOptions | undefined {
    if (props.filter) {
      return {
        name: {
          [Op.like]: `%${props.filter}%`,
        },
      };
    }
  }

  private async _get(id: string) {
    return await this.model.findByPk(id);
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
