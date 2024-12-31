import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { CategoriesController } from '../categories.controller';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryPresenter } from '../category.presenter';
import { CategoryCollectionPresenter } from '../category-collection.presenter';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const expectedOutput: CategoryOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
      created_at: new Date(),
    };

    const useCaseMock = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };

    controller['createUseCase' as any] = useCaseMock;

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
    };

    const output = await controller.create(input);

    expect(useCaseMock.execute).toHaveBeenCalledWith(input);
    expect(output).toBeInstanceOf(CategoryPresenter);
    expect(output).toStrictEqual(new CategoryPresenter(output));
  });

  it('should update a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    const expectedOutput: CategoryOutput = {
      id,
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
      created_at: new Date(),
    };

    const useCaseMock = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };

    controller['updateUseCase' as any] = useCaseMock;

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
    };

    const output = await controller.update(id, input);

    expect(useCaseMock.execute).toHaveBeenCalledWith({ id, ...input });
    expect(output).toBeInstanceOf(CategoryPresenter);
    expect(output).toStrictEqual(new CategoryPresenter(output));
  });

  it('should delete a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    const expectedOutput = undefined;

    const useCaseMock = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };

    controller['deleteUseCase' as any] = useCaseMock;

    const output = await controller.remove(id);

    expect(useCaseMock.execute).toHaveBeenCalledWith({ id });
    expect(output).toBeUndefined();
  });

  it('should get a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    const expectedOutput: CategoryOutput = {
      id,
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
      created_at: new Date(),
    };

    const useCaseMock = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };

    controller['getCategoryUseCase' as any] = useCaseMock;

    const output = await controller.findOne(id);

    expect(useCaseMock.execute).toHaveBeenCalledWith({ id });
    expect(output).toBeInstanceOf(CategoryPresenter);
    expect(output).toStrictEqual(new CategoryPresenter(output));
  });

  it('should search categories', async () => {
    const expectedOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };

    const input = {
      filter: 'movie',
      page: 1,
    };

    const useCaseMock = {
      execute: jest.fn().mockResolvedValue(expectedOutput),
    };

    controller['getCategoriesUseCase' as any] = useCaseMock;

    const output = await controller.search(input);

    expect(useCaseMock.execute).toHaveBeenCalledWith(input);
    expect(output).toBeInstanceOf(CategoryCollectionPresenter);
    expect(output).toStrictEqual(new CategoryCollectionPresenter(expectedOutput));
  });
});
