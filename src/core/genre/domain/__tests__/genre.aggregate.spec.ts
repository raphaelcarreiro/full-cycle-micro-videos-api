import { CategoryId } from '@core/category/domain/category.aggregate';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Genre } from '../genre.aggregate';

describe('Genre unit tests', () => {
  beforeEach(() => {
    Genre.prototype.validate = jest.fn().mockImplementation(Genre.prototype.validate);
  });

  test('should create a genre', () => {
    const categoryId = new CategoryId();

    const entity = Genre.create({
      name: 'Horror',
      category_ids: [categoryId],
    });

    const categoryIds = new Map([[categoryId.value, categoryId]]);

    expect(entity.genre_id).toBeInstanceOf(Uuid);
    expect(entity.name).toBe('Horror');
    expect(entity.category_ids).toEqual(categoryIds);
    expect(entity.is_active).toBeTruthy();
    expect(entity.created_at).toBeInstanceOf(Date);
  });

  test('should change genre name', () => {
    const entity = Genre.create({
      name: 'Horror',
      category_ids: [new CategoryId()],
    });

    const validateSpy = jest.spyOn(entity, 'validate');

    entity.changeName('New Genre');
    expect(entity.name).toBe('New Genre');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  it('should add a category', () => {
    const entity = Genre.create({
      name: 'Horror',
      category_ids: [new CategoryId()],
    });

    const categoryId = new CategoryId();

    const categoryIds = new Map([[categoryId.value, categoryId], ...entity.category_ids]);

    entity.addCategoryId(categoryId);

    expect(entity.category_ids).toEqual(categoryIds);
  });

  it('should deactivate a genre', () => {
    const entity = Genre.create({
      name: 'Horror',
      category_ids: [new CategoryId()],
    });

    entity.deactivate();

    expect(entity.is_active).toBeFalsy();
  });

  it('should activate a genre', () => {
    const entity = Genre.create({
      name: 'Horror',
      category_ids: [new CategoryId()],
    });

    entity.activate();

    expect(entity.is_active).toBeTruthy();
  });

  describe('create command', () => {
    test('shoud create a genre', () => {
      const categoryId = new CategoryId();

      const entity = Genre.create({
        name: 'Horror',
        category_ids: [categoryId],
      });

      const categoryIds = new Map([[categoryId.value, categoryId]]);

      expect(entity.genre_id).toBeInstanceOf(Uuid);
      expect(entity.name).toBe('Horror');
      expect(entity.category_ids).toEqual(categoryIds);
      expect(entity.is_active).toBeTruthy();
      expect(entity.created_at).toBeInstanceOf(Date);
      expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);
    });

    test('should create a genre with category ids', () => {
      const categoryId = new CategoryId();
      const categoryId2 = new CategoryId();

      const entity = Genre.create({
        name: 'Horror',
        category_ids: [categoryId, categoryId2],
      });

      const categoryIds = new Map([
        [categoryId.value, categoryId],
        [categoryId2.value, categoryId2],
      ]);

      expect(entity.genre_id).toBeInstanceOf(Uuid);
      expect(entity.name).toBe('Horror');
      expect(entity.category_ids).toEqual(categoryIds);
      expect(entity.is_active).toBeTruthy();
      expect(entity.created_at).toBeInstanceOf(Date);
      expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);
    });

    test('should create a genre with is_active = false', () => {
      const categoryId = new CategoryId();

      const entity = Genre.create({
        name: 'Horror',
        category_ids: [categoryId],
        is_active: false,
      });

      const categoryIds = new Map([[categoryId.value, categoryId]]);

      expect(entity.genre_id).toBeInstanceOf(Uuid);
      expect(entity.name).toBe('Horror');
      expect(entity.category_ids).toEqual(categoryIds);
      expect(entity.is_active).toBeFalsy();
      expect(entity.created_at).toBeInstanceOf(Date);
      expect(Genre.prototype.validate).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Genre validation tests', () => {
  describe('create command', () => {
    it('should throw an error when name property is invalid', () => {
      const category = Genre.create({
        name: 'a'.repeat(256),
        category_ids: [new CategoryId()],
      });

      expect(category.notification.hasErrors()).toBeTruthy();

      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });

  describe('changeName method', () => {
    it('should throw an error when name is invalid on changeName method', () => {
      const category = Genre.create({
        is_active: true,
        category_ids: [new CategoryId()],
      } as any);

      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
