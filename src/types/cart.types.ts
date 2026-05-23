
import type { Product } from "./product.types";


export type CartProduct = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  discountPercentage: number;
  discountedTotal: number;
  total: number;
};

export type CartItem = {
  id: number;
  userId: number;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
  products: CartProduct[];
};

export type CreateCart = {
  userId: number;
  products: { id: number; quantity: number }[];
};

export type UpdateCart = {
  products: { id: number; quantity: number }[];
};

export type DeletedCart = CartItem & {
  isDeleted: boolean;
  deletedOn: string;
};


export type CartEntry = {
  product: Product;
  quantity: number;  
};