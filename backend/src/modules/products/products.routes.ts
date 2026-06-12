import { FastifyInstance } from "fastify";
import * as ProductsController from "./products.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";
export async function productsRoutes(app: FastifyInstance) {
  app.get("/", ProductsController.getProducts);

  app.get("/:id", ProductsController.getProductById);

  app.post(
    "/",
    {
      preHandler: [ isAdmin],
    },
    ProductsController.createProduct
  );

  app.patch(
    "/:id",
    {
      preHandler: [isAdmin],
    },
    ProductsController.updateProduct
  );

  app.delete(
    "/:id",
    {
      preHandler: [ isAdmin],
    },
    ProductsController.deleteProduct
  );
}