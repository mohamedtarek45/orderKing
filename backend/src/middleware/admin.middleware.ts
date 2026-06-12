import { FastifyReply, FastifyRequest } from "fastify";
import {supabaseAuth, supabase} from "../config/supabase";

export async function isAdmin(req: FastifyRequest, reply: FastifyReply) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return reply.status(401).send({ message: "you are not authenticated" });
  }

  const { data, error } = await supabaseAuth.auth.getUser(token);
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user?.id)
    .single();

  if (error || profileError || !data.user || profile?.role !== "admin") {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }

  req.user = data.user;
}
