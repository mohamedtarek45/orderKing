import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  category_id: z.string().min(1),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  category_id: z.string().optional(),
});


// import { z } from "zod";

// export const createProductSchema = z.object({
//   name: z.string().min(2),
//   price: z.coerce.number().positive(),
//   description: z.string().optional(),
//   category_id: z.string(),
// });

// export const updateProductSchema = createProductSchema.partial();