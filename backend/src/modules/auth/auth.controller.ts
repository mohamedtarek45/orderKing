import { FastifyReply, FastifyRequest } from "fastify";
import * as AuthService from "./auth.service";

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const { email, password, name } = req.body as any;
  const result = await AuthService.registerUser(email, password, name);
  return reply.send(result);
}

export async function login(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as any;

  const result = await AuthService.loginUser(email, password);

  return reply.send(result);
}

export async function forgotPassword(req: FastifyRequest, reply: FastifyReply) {
  const { email } = req.body as any;

  await AuthService.sendResetPasswordEmail(email);

  return reply.send({ message: "Reset email sent" });
}

export async function getMe(req: FastifyRequest, reply: FastifyReply) {

  const user = await AuthService.getCurrentUser(req.user.id);

  return reply.send(user);
}
