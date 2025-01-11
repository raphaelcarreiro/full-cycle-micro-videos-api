import { DataType } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.aggregate';
import { setupSequelize } from '../../../testing/helpers';

describe('CategoryModel integration tests', () => {
  setupSequelize({ models: [CategoryModel] });

  test('mapping props', () => {
    const attributes = CategoryModel.getAttributes();

    const attributesKeys = Object.keys(attributes);

    expect(attributesKeys).toStrictEqual(['category_id', 'name', 'description', 'is_active', 'created_at']);
  });

  test('category id attribute', () => {
    const attributes = CategoryModel.getAttributes();

    const categoryIdAttribute = attributes.category_id;

    expect(categoryIdAttribute).toMatchObject({
      field: 'category_id',
      fieldName: 'category_id',
      primaryKey: true,
      type: DataType.UUID(),
    });
  });

  test('category name attribute', () => {
    const attributes = CategoryModel.getAttributes();

    const nameAttribute = attributes.name;

    expect(nameAttribute).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });
  });

  test('category description attribute', () => {
    const attributes = CategoryModel.getAttributes();

    const descriptionAttribute = attributes.description;

    expect(descriptionAttribute).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });
  });

  test('category is_active attribute', () => {
    const attributes = CategoryModel.getAttributes();

    const isActiveAttribute = attributes.is_active;

    expect(isActiveAttribute).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });
  });

  it('should create a category', async () => {
    const category = Category.fake().aCategory().build();

    await CategoryModel.create({
      category_id: category.category_id.value,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
