import "dotenv/config";
import Fastify, { FastifyError } from "fastify";
import cors from "@fastify/cors";
import { authRoutes } from "./modules/auth/auth.routes";
import { productsRoutes } from "./modules/products/products.routes";
import { ordersRoutes } from "./modules/orders/orders.routes";
import multipart from "@fastify/multipart";

const app = Fastify({ logger: true });

app.setErrorHandler((error: FastifyError, request, reply) => {
  console.log(error);

  return reply.status(400).send({
    success: false,
    message: error.message || "Something went wrong",
  });
});
app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});
app.register(multipart, { attachFieldsToBody: true });

app.register(authRoutes, { prefix: "/auth" });
app.register(productsRoutes, { prefix: "/products" });
app.register(ordersRoutes, { prefix: "/orders" });

export default app;
