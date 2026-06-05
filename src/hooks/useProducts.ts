import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteProduct,
    getCategories,
    getProductById,
    getProducts,
    getProductsByCategory,
    updateProduct,
} from "../api/product.api";
const CART_STALE_TIME = 2 * 60 * 1000; 
export const useProducts = (page: number, search: string) => {
  return useQuery({
    queryKey: ["products", page, search],
    queryFn: () => getProducts({ page, search }),
    staleTime: CART_STALE_TIME,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
     staleTime: CART_STALE_TIME,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
     staleTime: CART_STALE_TIME,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  staleTime: CART_STALE_TIME,
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
     
      return updateProduct(id, data);
    },

  onSuccess: (_, variables) => {
  const { id, data } = variables;

  queryClient.setQueryData(["product", id], (old: any) => ({
    ...old,
    ...data,
  }));

  queryClient.setQueriesData(
    { queryKey: ["products"], exact: false },
    (old: any) => {
      if (!old) return old;
      return old.map((p: any) =>
        p.id === id ? { ...p, ...data } : p
      );
    }
  );
},
  });
};
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: (_, id) => {
      queryClient.setQueriesData(
        { queryKey: ["products"], exact: false },
        (old: any) => {
          if (!old) return old;
          return old.filter((p: any) => p.id !== id);
        }
      );

      queryClient.removeQueries({
        queryKey: ["product", id],
      });
    },
  });
};