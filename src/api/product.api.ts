import type { ProductsResponse } from "@/src/types/api.types";
import type { Product } from "@/src/types/product.types";
import { api } from "./client";


export const getProducts = async (params: {
  page: number;
  search: string;
}): Promise<Product[]> => {
  const { data } = await api.get<ProductsResponse>("/products/search", {
    params: {
      q: params.search || "",
      limit: 20,
      skip: params.page * 20,
    },
  });

  return data.products;
};


export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
};


export const getCategories = async (): Promise<string[]> => {
  const { data } = await api.get<string[]>("/products/category-list");
  return data;
};


export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const { data } = await api.get<ProductsResponse>(
    `/products/category/${category}`
  );

  return data.products;
};


export const deleteProduct = async (id: number): Promise<{ id: number }> => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};


export const updateProduct = async (
  id: number,
  payload: Partial<Product>
): Promise<Product> => {
  const { data } = await api.put<Product>(`/products/${id}`, payload);
  return data;
};