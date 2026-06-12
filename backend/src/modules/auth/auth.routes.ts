import { FastifyInstance } from "fastify";
import * as AuthController from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
export async function authRoutes(app: FastifyInstance) {
  app.post("/register", AuthController.register);
  app.post("/login", AuthController.login);
  app.post("/forgotpassword", AuthController.forgotPassword);
    console.log("authenticate =", app.authenticate);
  app.get(
    "/me",
    {
      preHandler: [authenticate],
    },
    AuthController.getMe
  );
}