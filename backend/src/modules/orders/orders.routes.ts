import { FastifyInstance } from "fastify";
import * as OrdersController from "./orders.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { isAdmin } from "../../middleware/admin.middleware";
export async function ordersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: [authenticate],
    },
    OrdersController.placeOrder
  );

  app.get(
    "/my",
    {
      preHandler: [authenticate],
    },
    OrdersController.getMyOrders
  );
  app.get("/:id", OrdersController.getOrderById);

  app.get(
    "/",
    {
      preHandler: [isAdmin],
    },
    OrdersController.getAllOrders
  );

  app.patch(
    "/:id/status",
    {
      preHandler: [ isAdmin],
    },
    OrdersController.updateOrderStatus
  );
}