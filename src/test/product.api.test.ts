import MockAdapter from "axios-mock-adapter";
import { api } from "../api/client";
import {
  getCategories,
  getProductById,
  getProducts,
  getProductsByCategory,
  updateProduct
} from "../api/product.api";

const mock = new MockAdapter(api);

const productMock = {
  id: 1,
  title: "iPhone 9",
  price: 549,
  category: "smartphones",
  description: "An apple mobile",
};

afterEach(() => mock.reset());

describe("getProducts", () => {
  it("returns products list", async () => {
    mock.onGet("/products/search").reply(200, {
      products: [productMock],
    });

    const result = await getProducts({ page: 0, search: "" });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("sends correct params", async () => {
    mock.onGet("/products/search").reply((config) => {
      expect(config.params.limit).toBe(20);
      expect(config.params.skip).toBe(20);
      expect(config.params.q).toBe("iphone");

      return [200, { products: [] }];
    });

    await getProducts({ page: 1, search: "iphone" });
  });

  it("returns empty array when no results", async () => {
    mock.onGet("/products/search").reply(200, { products: [] });

    const result = await getProducts({ page: 0, search: "unknown" });

    expect(result).toEqual([]);
  });

  it("throws on network error", async () => {
    mock.onGet("/products/search").networkError();

    await expect(getProducts({ page: 0, search: "" })).rejects.toThrow();
  });

  it("throws on server error", async () => {
    mock.onGet("/products/search").reply(500);

    await expect(getProducts({ page: 0, search: "" })).rejects.toThrow();
  });
});

describe("getProductById", () => {
  it("returns product detail", async () => {
    mock.onGet("/products/1").reply(200, productMock);

    const result = await getProductById(1);

    expect(result.id).toBe(1);
    expect(result.title).toBe("iPhone 9");
  });

  it("throws when product not found", async () => {
    mock.onGet("/products/999").reply(404);

    await expect(getProductById(999)).rejects.toThrow();
  });
});

describe("getCategories", () => {
  it("returns categories list", async () => {
    const categories = ["smartphones", "laptops"];

    mock.onGet("/products/category-list").reply(200, categories);

    const result = await getCategories();

    expect(result).toEqual(categories);
  });

  it("throws on error", async () => {
    mock.onGet("/products/category-list").reply(500);

    await expect(getCategories()).rejects.toThrow();
  });
});

describe("getProductsByCategory", () => {
  it("returns products by category", async () => {
    mock.onGet("/products/category/smartphones").reply(200, {
      products: [productMock],
    });

    const result = await getProductsByCategory("smartphones");

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("smartphones");
  });
});


describe("updateProduct", () => {
  it("updates product successfully", async () => {
    mock.onPut("/products/1").reply(200, {
      ...productMock,
      title: "Updated iPhone",
      price: 499,
    });

    const result = await updateProduct(1, {
      title: "Updated iPhone",
      price: 499,
    });

    expect(result.title).toBe("Updated iPhone");
    expect(result.price).toBe(499);
  });

  it("throws on network error", async () => {
    mock.onPut("/products/1").networkError();

    await expect(updateProduct(1, { title: "test" })).rejects.toThrow();
  });
});