import { Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { CategoryRepository } from '../category.repository';
import { Category } from '../../../../domain/category.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CategorySearchParams } from '../../../../domain/category.repository.interface';

describe('CategoryRepository integration tests', () => {
  let sequelize: Sequelize;
  let repository: CategoryRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel],
      logging: false,
    });

    await sequelize.sync({ force: true });

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

  it('should search categories', async () => {
    const category1 = Category.fake().aCategory().withName('movie').build();
    const category2 = Category.fake().aCategory().withName('serie').build();
    const category3 = Category.fake().aCategory().withName('anime').build();

    await repository.bulkInsert([category1, category2, category3]);

    const searchResult = await repository.search(new CategorySearchParams({ filter: 'movie' }));

    expect(searchResult.items).toHaveLength(1);
    expect(searchResult.toJSON({ forceEntity: true })).toMatchObject({
      items: [category1.toJSON()],
      total: 1,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });
});
