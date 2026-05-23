import { addCart } from "@/src/api/carts.api";
import type { CartEntry } from "@/src/types/cart.types";
import type { Product } from "@/src/types/product.types";
import { create } from "zustand";

type CartState = {
  items: CartEntry[];

  isCheckingOut: boolean;

  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;

  increment: (productId: number) => void;
  decrement: (productId: number) => void;

  clearCart: () => void;

  totalItems: () => number;
  totalPrice: () => number;

  checkout: (userId: number) => Promise<any>;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  isCheckingOut: false,

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.product.id === product.id
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? {
                  ...i,
                  quantity: i.quantity + 1,
                }
              : i
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            product,
            quantity: 1,
          },
        ],
      };
    }),

 removeItem: (productId) =>
  set((state) => ({
    items: state.items.filter(
      (i) => i.product.id !== productId
    ),
  })),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => i.product.id !== productId
          ),
        };
      }

      return {
        items: state.items.map((i) =>
          i.product.id === productId
            ? {
                ...i,
                quantity,
              }
            : i
        ),
      };
    }),

  increment: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId
          ? {
              ...i,
              quantity: i.quantity + 1,
            }
          : i
      ),
    })),

  decrement: (productId) =>
    set((state) => {
      const item = state.items.find(
        (i) => i.product.id === productId
      );

      if (!item) return state;

      if (item.quantity <= 1) {
        return {
          items: state.items.filter(
            (i) => i.product.id !== productId
          ),
        };
      }

      return {
        items: state.items.map((i) =>
          i.product.id === productId
            ? {
                ...i,
                quantity: i.quantity - 1,
              }
            : i
        ),
      };
    }),

  clearCart: () =>
    set({
      items: [],
    }),

  totalItems: () =>
    get().items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),

  totalPrice: () =>
    get().items.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    ),

  checkout: async (userId) => {
    try {
      set({
        isCheckingOut: true,
      });

      const payload = {
        userId,
        products: get().items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const result = await addCart(payload);

      set({
        items: [],
      });

      return result;
    } catch (error) {
      console.log("CHECKOUT ERROR:", error);
      throw error;
    } finally {
      set({
        isCheckingOut: false,
      });
    }
  },
}));