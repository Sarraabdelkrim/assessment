import MockAdapter from "axios-mock-adapter";
import { api } from "../api/client";

import {
    addCart,
    deleteCart,
    getCartById,
    getCarts,
    getCartsByUser,
    updateCart,
} from "../api/carts.api";

const mock = new MockAdapter(api);

const cartMock = {
  id: 1,
  userId: 10,
  products: [
    { id: 1, quantity: 2 },
  ],
  total: 100,
  totalProducts: 1,
  totalQuantity: 2,
};

afterEach(() => mock.reset());
afterAll(() => mock.restore());

describe("get Carts", () => {
  it("should return carts list", async () => {
    mock.onGet("/carts").reply(200, {
      carts: [cartMock],
    });

    const result = await getCarts();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("should return empty array", async () => {
    mock.onGet("/carts").reply(200, {
      carts: [],
    });

    const result = await getCarts();

    expect(result).toEqual([]);
  });

  it("should throw error on network failure", async () => {
    mock.onGet("/carts").networkError();

    await expect(getCarts()).rejects.toThrow();
  });
});

describe("getCartById", () => {
  it("should return cart by id", async () => {
    mock.onGet("/carts/1").reply(200, cartMock);

    const result = await getCartById(1);

    expect(result.id).toBe(1);
    expect(result.total).toBe(100);
  });

  it("should throw error if not found", async () => {
    mock.onGet("/carts/999").reply(404);

    await expect(getCartById(999)).rejects.toThrow();
  });
});

describe("getCartsByUser", () => {
  it("should return user carts", async () => {
    mock.onGet("/carts/user/10").reply(200, {
      carts: [cartMock],
    });

    const result = await getCartsByUser(10);

    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe(10);
  });

  it("should return empty list", async () => {
    mock.onGet("/carts/user/10").reply(200, {
      carts: [],
    });

    const result = await getCartsByUser(10);

    expect(result).toEqual([]);
  });
});

describe("addCart", () => {
  it("should create cart successfully", async () => {
    const payload = {
      userId: 10,
      products: [{ id: 1, quantity: 1 }],
    };

    mock.onPost("/carts/add").reply(200, {
      id: 2,
      ...payload,
    });

    const result = await addCart(payload);

    expect(result.id).toBe(2);
    expect(result.userId).toBe(10);
  });

  it("should throw error on network failure", async () => {
    mock.onPost("/carts/add").networkError();

    await expect(
      addCart({ userId: 1, products: [] })
    ).rejects.toThrow();
  });
});

describe("updateCart", () => {
  it("should update cart successfully", async () => {
    mock.onPut("/carts/1").reply(200, {
      ...cartMock,
      total: 200,
    });

    const result = await updateCart(1, {
      products: [{ id: 1, quantity: 5 }],
    });

    expect(result.total).toBe(200);
  });

  it("should throw error on failure", async () => {
    mock.onPut("/carts/1").networkError();

    await expect(
      updateCart(1, { products: [] })
    ).rejects.toThrow();
  });
});

describe("deleteCart", () => {
  it("should delete cart successfully", async () => {
    mock.onDelete("/carts/1").reply(200, {
      id: 1,
      isDeleted: true,
    });

    const result = await deleteCart(1);

    expect(result.isDeleted).toBe(true);
  });

  it("should throw error on failure", async () => {
    mock.onDelete("/carts/1").networkError();

    await expect(deleteCart(1)).rejects.toThrow();
  });
});