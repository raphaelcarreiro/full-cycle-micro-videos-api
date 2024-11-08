import { SearchParams } from "../search-params";

describe("SearchParams Unit Test", () => {
  it("page attribute", () => {
    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: "", expected: 1 },
      { page: "fake", expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 5 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ page: item.page as any }).page).toBe(
        item.expected
      );
    });
  });

  it("per_page attribute", () => {
    const arrange = [
      { per_page: null, expected: 15 },
      { per_page: undefined, expected: 15 },
      { per_page: "", expected: 15 },
      { per_page: "fake", expected: 15 },
      { per_page: 0, expected: 15 },
      { per_page: -1, expected: 15 },
      { per_page: 5.5, expected: 5 },
      { per_page: true, expected: 15 },
      { per_page: false, expected: 15 },
      { per_page: {}, expected: 15 },
      { per_page: 20, expected: 20 },
    ];

    arrange.forEach((item) => {
      const params = new SearchParams({ per_page: item.per_page as any });
      expect(params.per_page).toBe(item.expected);
    });
  });

  it("sort attribute", () => {
    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: "", expected: null },
      { sort: 15, expected: "15" },
      { sort: "fake", expected: "fake" },
      { sort: true, expected: "true" },
      { sort: -10, expected: "-10" },
      { sort: {}, expected: "[object Object]" },
      { sort: 5.5, expected: "5.5" },
    ];

    arrange.forEach((item) => {
      const params = new SearchParams({ sort: item.sort as any });
      expect(params.sort).toBe(item.expected);
    });
  });

  it("sort_direction attribute", () => {
    expect(new SearchParams({ sort: null as any }).sort_direction).toBe(null);
    expect(new SearchParams({ sort: "" }).sort_direction).toBe(null);
    expect(new SearchParams({ sort: undefined }).sort_direction).toBe(null);

    const arrange = [
      { sort_direction: null, expected: "asc" },
      { sort_direction: undefined, expected: "asc" },
      { sort_direction: "", expected: "asc" },
      { sort_direction: 5, expected: "asc" },
      { sort_direction: -1, expected: "asc" },
      { sort_direction: true, expected: "asc" },
      { sort_direction: "asc", expected: "asc" },
      { sort_direction: "ASC", expected: "asc" },
      { sort_direction: "desc", expected: "desc" },
      { sort_direction: "DESC", expected: "desc" },
    ];

    arrange.forEach((item) => {
      const params = new SearchParams({
        sort_direction: item.sort_direction as any,
        sort: "some value",
      });
      expect(params.sort_direction).toBe(item.expected);
    });
  });

  it("filter attribute", () => {
    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: "", expected: null },
      { filter: 15, expected: 15 },
      { filter: "fake", expected: "fake" },
      { filter: true, expected: true },
      { filter: -10, expected: -10 },
      { filter: {}, expected: {} },
      { filter: 5.5, expected: 5.5 },
    ];

    arrange.forEach((item) => {
      const params = new SearchParams({ filter: item.filter as any });
      expect(params.filter).toStrictEqual(item.expected);
    });
  });
});
