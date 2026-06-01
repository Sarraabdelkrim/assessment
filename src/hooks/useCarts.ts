// hooks/cart.hooks.ts
import {
  addCart,
  deleteCart,
  getCartById,
  getCarts,
  getCartsByUser,
  updateCart,
} from "@/src/api/carts.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem, CreateCart, UpdateCart } from "../types/cart.types";

const CART_STALE_TIME = 2 * 60 * 1000; 

export const useCarts = () => {
  return useQuery({
    queryKey: ["carts"],
    queryFn: getCarts,
    staleTime: CART_STALE_TIME,
  });
};

export const useCart = (id: number) => {
  return useQuery({
    queryKey: ["cart", id],
    queryFn: () => getCartById(id),
    enabled: !!id,
    staleTime: CART_STALE_TIME,
  });
};

export const useCartsByUser = (userId: number) => {
  return useQuery({
    queryKey: ["carts", "user", userId],
    queryFn: () => getCartsByUser(userId),
    enabled: !!userId,
    staleTime: CART_STALE_TIME,
  });
};

export const useAddCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCart) => addCart(data),

    onSuccess: (newCart) => {
      queryClient.setQueryData(["carts"], (old: CartItem[] | undefined) => {
        if (!old) return [newCart];
        return [...old, newCart];
      });

      queryClient.setQueryData(
        ["carts", "user", newCart.userId],
        (old: CartItem[] | undefined) => {
          if (!old) return [newCart];
          return [...old, newCart];
        }
      );

      queryClient.setQueryData(["cart", newCart.id], newCart);
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCart }) =>
      updateCart(id, data),

    onSuccess: (updatedCart, { id }) => {
      queryClient.setQueryData(["cart", id], (old: CartItem | undefined) => ({
        ...old,
        ...updatedCart,
      }));

      queryClient.setQueryData(["carts"], (old: CartItem[] | undefined) => {
        if (!old) return old;
        return old.map((c) => (c.id === id ? { ...c, ...updatedCart } : c));
      });

      queryClient.setQueryData(
        ["carts", "user", updatedCart.userId],
        (old: CartItem[] | undefined) => {
          if (!old) return old;
          return old.map((c) => (c.id === id ? { ...c, ...updatedCart } : c));
        }
      );
    },
  });
};

export const useDeleteCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCart,

    onSuccess: (deletedCart, id) => {
      queryClient.setQueryData(["carts"], (old: CartItem[] | undefined) => {
        if (!old) return old;
        return old.filter((c) => c.id !== id);
      });

      //  Plus d'erreur — deletedCart est typé DeletedCart qui étend CartItem
      queryClient.setQueryData(
        ["carts", "user", deletedCart.userId],
        (old: CartItem[] | undefined) => {
          if (!old) return old;
          return old.filter((c) => c.id !== id);
        }
      );

      queryClient.removeQueries({ queryKey: ["cart", id] });
    },
  });
};