import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_ORIGIN: z.string().default("http://localhost:3000,http://localhost:5173"),
  JWT_ACCESS_SECRET: z.string().min(16).default("change-this-access-secret-for-production"),
  JWT_REFRESH_SECRET: z.string().min(16).default("change-this-refresh-secret-for-production"),
  JWT_ISSUER: z.string().min(2).default("gigs-mtaani"),
  JWT_AUDIENCE: z.string().min(2).default("gigs-mtaani-clients"),
  ACCESS_TOKEN_TTL: z.string().default("10m"),
  REFRESH_TOKEN_TTL: z.string().default("30d"),
  ARGON2_MEMORY_COST: z.coerce.number().default(65536),
  ARGON2_TIME_COST: z.coerce.number().default(3),
  ARGON2_PARALLELISM: z.coerce.number().default(1)
});

export type AppConfig = z.infer<typeof envSchema>;

export const config: AppConfig = envSchema.parse(process.env);
