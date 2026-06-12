import { FastifyRequest, FastifyReply } from "fastify";
import  {supabase , supabaseAuth}  from "../config/supabase";

export async function authenticate(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return reply.status(401).send({ message: "you are not authenticated" });
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);

  if (error || !data.user) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }

  req.user = data.user;
}