// import { z } from "zod";

// export const createOrderSchema = z.object({
//   items: z
//     .array(
//       z.object({
//         productId: z.uuid(),
//         quantity: z.number().int().positive(),
//       })
//     )
//     .min(1),
// });

// export type CreateOrderInput = z.infer<
//   typeof createOrderSchema
// >;

import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1),
    })
  ),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
});
