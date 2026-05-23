import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;