import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category unit tests", () => {
  test("should create a category with name prop", () => {
    const created_at = new Date();

    let category = new Category({
      name: "Movie",
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  it("should create a category with name and description props", () => {
    const created_at = new Date();

    const category = new Category({
      name: "Movie",
      description: "Movie description",
      is_active: false,
      created_at,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie description");
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  test("should change category name", () => {
    const category = new Category({
      name: "Movie",
    });

    category.changeName("New Movie");
    expect(category.name).toBe("New Movie");
  });

  it("should change category description", () => {
    const category = new Category({
      name: "Movie",
    });

    category.changeDescription("New description");
    expect(category.description).toBe("New description");
  });
});

describe("create command", () => {
  test("shoud create a category", () => {
    const category = Category.create({
      name: "Movie",
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  test("should create a category with description", () => {
    const category = Category.create({
      name: "Movie",
      description: "Movie description",
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie description");
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);
  });

  test("should create a category with is_active = false", () => {
    const category = Category.create({
      name: "Movie",
      is_active: false,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);
  });
});

describe("category_id field", () => {
  const arrange = [{ id: null }, { id: undefined }, { id: new Uuid() }];

  test.each(arrange)("id is %j", ({ id }) => {
    const category = new Category({
      category_id: id as any,
      name: "Movie",
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
  });
});
