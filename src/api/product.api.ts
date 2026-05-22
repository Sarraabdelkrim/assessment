import { api } from "./client";

export const getProducts = async ({ page, search }: { page: number; search: string }) => {
  const res = await api.get("/products/search", {
    params: {
      q: search || "",
      limit: 20,
      skip: page * 20,
    },
  });
  return res.data.products;
};

export const getProductById = async (id: number) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const getCategories = async (): Promise<string[]> => {
  const res = await api.get("/products/category-list");
  return res.data;
};

export const getProductsByCategory = async (category: string) => {
  const res = await api.get(`/products/category/${category}`);
  return res.data.products;
};

export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const updateProduct = async (id: number, data: any) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};