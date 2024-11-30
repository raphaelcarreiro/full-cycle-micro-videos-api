import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import {
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from '../../../domain/category.repository.interface';
import { CategoryModel } from './category.model';
import { WhereOptions } from 'sequelize';

export class CategoryRepository implements ICategoryRepository {
  sortableFields = ['name', 'created_at'];

  constructor(private readonly model: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    await this.model.create({
      category_id: entity.category_id.value,
      name: entity.name,
      created_at: entity.created_at,
      is_active: entity.is_active,
      description: entity.description,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.model.bulkCreate(
      entities.map(entity => ({
        category_id: entity.category_id.value,
        name: entity.name,
        created_at: entity.created_at,
        is_active: entity.is_active,
        description: entity.description,
      })),
    );
  }

  async update(entity: Category): Promise<void> {
    const category = await this._get(entity.category_id.value);

    if (!category) {
      throw new NotFoundError(entity.category_id.value, this.getEntity());
    }

    await this.model.update(
      {
        name: entity.name,
        created_at: entity.created_at,
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

    return new Category({
      category_id: new Uuid(category.category_id),
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.model.findAll();

    return categories.map(
      category =>
        new Category({
          category_id: new Uuid(category.category_id),
          name: category.name,
          description: category.description,
          is_active: category.is_active,
          created_at: category.created_at,
        }),
    );
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
      items: rows.map(
        row =>
          new Category({
            category_id: new Uuid(row.category_id),
            name: row.name,
            description: row.description,
            is_active: row.is_active,
            created_at: row.created_at,
          }),
      ),
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
