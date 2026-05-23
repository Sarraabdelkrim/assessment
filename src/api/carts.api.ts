
import type { CartItem, CreateCart, DeletedCart, UpdateCart } from "../types/cart.types";
import { api } from "./client";

export const getCarts = async (): Promise<CartItem[]> => {
  const res = await api.get("/carts");
  return res.data.carts;
};

export const getCartById = async (id: number): Promise<CartItem> => {
  const res = await api.get(`/carts/${id}`);
  return res.data;
};

export const getCartsByUser = async (userId: number): Promise<CartItem[]> => {
  const res = await api.get(`/carts/user/${userId}`);
  return res.data.carts;
};

export const addCart = async (data: CreateCart): Promise<CartItem> => {
  const res = await api.post("/carts/add", data);
  return res.data;
};

export const updateCart = async (id: number, data: UpdateCart): Promise<CartItem> => {
  const res = await api.put(`/carts/${id}`, data);
  return res.data;
};

export const deleteCart = async (id: number): Promise<DeletedCart> => {
  const res = await api.delete(`/carts/${id}`);
  return res.data;
};