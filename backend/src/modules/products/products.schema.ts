
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().positive(),
  description: z.string().optional(),
  category_id: z.string(),
});

export const updateProductSchema = createProductSchema.partial();