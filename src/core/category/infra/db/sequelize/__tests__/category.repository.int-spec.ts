import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { CategoryRepository } from '../category.repository';
import { Category } from '../../../../domain/category.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CategorySearchParams } from '../../../../domain/category.repository.interface';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../testing/helpers';

describe('CategoryRepository integration tests', () => {
  setupSequelize({ models: [CategoryModel] });

  let repository: CategoryRepository;

  beforeEach(async () => {
    repository = new CategoryRepository(CategoryModel);
  });

  it('should insert a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const model = await CategoryModel.findByPk(category.category_id.value);

    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should create a bulk of categories', async () => {
    const categories = Category.fake().theCategories(2).build();

    await repository.bulkInsert(categories);

    const models = await CategoryModel.findAll();

    expect(models.map(model => model.toJSON())).toStrictEqual(categories.map(category => category.toJSON()));
  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    await repository.delete(category.category_id);

    const model = await CategoryModel.findByPk(category.category_id.value);

    expect(model).toBeNull();
  });

  it('should update a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    category.changeName('new name');
    category.changeDescription('new description');
    category.deactivate();

    await repository.update(category);

    const model = await CategoryModel.findByPk(category.category_id.value);

    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should throw an error when trying to update a non-existing category', async () => {
    const category = Category.fake().aCategory().build();

    await expect(repository.update(category)).rejects.toThrow(NotFoundError);
  });

  it('should throw an error when trying to delete a non-existing category', async () => {
    const category = Category.fake().aCategory().build();

    await expect(repository.delete(category.category_id)).rejects.toThrow(NotFoundError);
  });

  it('should find a category by id', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const foundCategory = await repository.findById(category.category_id);

    expect(foundCategory).toStrictEqual(category);
  });

  it('should return null when trying to find by no-existing id', async () => {
    const category = await repository.findById(new Uuid());
    expect(category).toBeNull();
  });

  it('should return all categories', async () => {
    const category1 = Category.fake().aCategory().build();
    const category2 = Category.fake().aCategory().build();
    const category3 = Category.fake().aCategory().build();

    await repository.bulkInsert([category1, category2, category3]);

    const categories = await repository.findAll();

    expect(categories).toHaveLength(3);
    expect(JSON.stringify(categories)).toEqual(JSON.stringify([category1, category2, category3]));
  });

  it('should search categories', async () => {
    const category1 = Category.fake().aCategory().withName('movie').build();
    const category2 = Category.fake().aCategory().withName('serie').build();
    const category3 = Category.fake().aCategory().withName('anime').build();

    await repository.bulkInsert([category1, category2, category3]);

    const searchResult = await repository.search(new CategorySearchParams({ filter: 'movie' }));

    expect(searchResult.items).toHaveLength(1);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [category1.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should search categories with pagination and sort', async () => {
    const category1 = Category.fake().aCategory().withName('movie').build();
    const category2 = Category.fake().aCategory().withName('serie').build();
    const category3 = Category.fake().aCategory().withName('anime').build();

    await repository.bulkInsert([category1, category2, category3]);

    const searchResult = await repository.search(
      new CategorySearchParams({ per_page: 1, sort: 'name', sort_direction: 'asc' }),
    );

    expect(searchResult.items).toHaveLength(1);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [category3.toJSON()],
      total: 3,
      current_page: 1,
      per_page: 1,
      last_page: 3,
    });
  });

  it('should search categories with filter, pagination and sort', async () => {
    const category1 = Category.fake().aCategory().withName('movie').build();
    const category2 = Category.fake().aCategory().withName('serie').build();
    const category3 = Category.fake().aCategory().withName('anime').build();

    await repository.bulkInsert([category1, category2, category3]);

    const searchResult = await repository.search(
      new CategorySearchParams({
        filter: 'movie',
        per_page: 1,
        sort: 'name',
        sort_direction: 'asc',
      }),
    );

    expect(searchResult.items).toHaveLength(1);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [category1.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 1,
      last_page: 1,
    });
  });

  it('should search categories with pagination', async () => {
    const category1 = Category.fake().aCategory().withName('movie').withCreatedAt(new Date('2024-12-03')).build();
    const category2 = Category.fake().aCategory().withName('serie').withCreatedAt(new Date('2024-12-01')).build();
    const category3 = Category.fake().aCategory().withName('anime').withCreatedAt(new Date('2024-12-02')).build();

    await repository.bulkInsert([category1, category2, category3]);

    const searchResult = await repository.search(new CategorySearchParams({ per_page: 2 }));

    expect(searchResult.items).toHaveLength(2);
    expect(searchResult.toJSON({ forceEntity: true })).toStrictEqual({
      items: [category1.toJSON(), category3.toJSON()],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
