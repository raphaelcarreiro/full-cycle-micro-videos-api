import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category unit tests", () => {
  let validateSpy: any;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });

  test("should create a category with name prop", () => {
    let category = Category.create({
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
    const category = Category.create({
      name: "Movie",
    });

    category.changeName("New Movie");
    expect(category.name).toBe("New Movie");
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  it("should change category description", () => {
    const category = Category.create({
      name: "Movie",
    });

    category.changeDescription("New description");
    expect(category.description).toBe("New description");
    expect(validateSpy).toHaveBeenCalledTimes(2);
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
      expect(validateSpy).toHaveBeenCalledTimes(1);
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
});

describe("Category validation tests", () => {
  describe("create command", () => {
    it("should throw an error when name property is invalid", () => {
      expect(() => Category.create({ name: null })).containsErrorMessages({
        name: ["name should not be empty", "name must be a string"],
      });

      expect(() => Category.create({ name: "" })).containsErrorMessages({
        name: ["name should not be empty"],
      });

      expect(() => Category.create({ name: 10 as any })).containsErrorMessages({
        name: ["name must be a string"],
      });

      expect(() =>
        Category.create({ name: "Movie", is_active: 10 as any })
      ).containsErrorMessages({
        is_active: ["is_active must be a boolean value"],
      });

      expect(() =>
        Category.create({ name: "Movie", description: 10 as any })
      ).containsErrorMessages({
        description: ["description must be a string"],
      });
    });
  });

  describe("changeName method", () => {
    it("should throw an error when name is invalid on changeName method", () => {
      const category = Category.create({ name: "Movie" });

      expect(() => category.changeName(null)).containsErrorMessages({
        name: ["name should not be empty", "name must be a string"],
      });
    });
  });

  describe("changeDescription method", () => {
    it("should throw an error when description is invalid on changeDescription method", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });

      expect(() => category.changeDescription(5 as any)).containsErrorMessages({
        description: ["description must be a string"],
      });
    });
  });
});
