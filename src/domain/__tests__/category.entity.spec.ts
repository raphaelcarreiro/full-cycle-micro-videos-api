import { Category } from "../category.entity";

describe("Category unit tests", () => {
  test("constructor", () => {
    const created_at = new Date();

    let category = new Category({
      name: "Movie",
    });

    expect(category.category_id).toBeUndefined();
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    category = new Category({
      name: "Movie",
      description: "Movie description",
      is_active: false,
      created_at,
    });

    expect(category.category_id).toBeUndefined();
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie description");
    expect(category.is_active).toBeFalsy();
    expect(category.created_at).toBeInstanceOf(Date);
  });
});
