import { z } from "zod";

export const productSchema = z.object({
   title: z.string().min(1, "validation.titleRequired"),
  price: z.number().min(0, "validation.pricePositive"),
  category: z.string().min(1, "validation.categoryRequired"),
  description: z.string().min(1, "validation.descriptionRequired"),
});

export type ProductFormData = z.infer<typeof productSchema>;