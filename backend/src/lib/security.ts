import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";
import { config } from "../config.js";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: config.ARGON2_MEMORY_COST,
    timeCost: config.ARGON2_TIME_COST,
    parallelism: config.ARGON2_PARALLELISM
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

export function randomToken(bytes = 48): string {
  return randomBytes(bytes).toString("base64url");
}

export function redactPII(value: string): string {
  if (!value) return "";
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

export function hashIpAndAgent(ip: string, userAgent: string): string {
  return sha256(`${ip}|${userAgent}`);
}

