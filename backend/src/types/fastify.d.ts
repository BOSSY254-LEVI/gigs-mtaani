import "fastify";
import "@fastify/jwt";

export type AppRole = "STUDENT" | "ADMIN";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string;
      role: AppRole;
      sessionId: string;
    };
  }
}

declare module "fastify" {
  interface FastifyRequest {
    requestId: string;
  }
}
