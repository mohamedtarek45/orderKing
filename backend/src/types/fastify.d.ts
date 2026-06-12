import "fastify";
import { User } from '@supabase/supabase-js';

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
    isAdmin: any;
  }

  interface FastifyRequest {
    user: User;
  }
}