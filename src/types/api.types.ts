import { Product } from "./product.types";

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};