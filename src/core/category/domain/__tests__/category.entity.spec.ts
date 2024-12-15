import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../category.entity';

describe('Category unit tests', () => {
  beforeEach(() => {
    Category.prototype.validate = jest.fn().mockImplementation(Category.prototype.validate);
  });

  test('should create a category with name prop', () => {
    const category = Category.create({
      name: 'Movie',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it('should create a category with name and description props', () => {
    const created_at = new Date();

    const category = new Category({
      name: 'Movie',
      description: 'Movie description',
      is_active: false,
      created_at,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movie');
    expect(category.description).toBe('Movie description');
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  test('should change category name', () => {
    const category = Category.create({
      name: 'Movie',
    });

    const validateSpy = jest.spyOn(category, 'validate');

    category.changeName('New Movie');
    expect(category.name).toBe('New Movie');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  it('should change category description', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.changeDescription('New description');
    expect(category.description).toBe('New description');
  });

  it('should deactivate a category', () => {
    const category = Category.create({
      name: 'Movie',
    });

    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });

  it('should activate a category', () => {
    const category = Category.create({
      name: 'Movie',
      is_active: false,
    });

    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  describe('create command', () => {
    test('shoud create a category', () => {
      const category = Category.create({
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
    });

    test('should create a category with description', () => {
      const category = Category.create({
        name: 'Movie',
        description: 'Movie description',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBe('Movie description');
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
    });

    test('should create a category with is_active = false', () => {
      const category = Category.create({
        name: 'Movie',
        is_active: false,
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movie');
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(Category.prototype.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe('category_id field', () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }];

    test.each(arrange)('id is %j', ({ id }) => {
      const category = new Category({
        category_id: id as any,
        name: 'Movie',
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
    });
  });
});

describe('Category validation tests', () => {
  describe('create command', () => {
    it('should throw an error when name property is invalid', () => {
      const category = Category.create({
        name: 'a'.repeat(256),
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
      const category = Category.create({ description: 'Movie' } as any);

      expect(category.notification).notificationContainsErrorMessages([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    });
  });
});
