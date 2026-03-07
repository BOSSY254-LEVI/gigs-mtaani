// Local schema definitions to replace @gigs/shared
import { z } from "zod";

export const registerSchema = z.object({
  campusEmail: z.string().email(),
  phone: z.string(),
  password: z.string().min(8),
  displayName: z.string().min(2),
  campusId: z.string()
});

export const loginSchema = z.object({
  identifier: z.string(),
  password: z.string(),
  mfaCode: z.string().optional()
});

export const createGigSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string(),
  payAmount: z.number().min(0),
  currency: z.enum(["KES", "USD", "EUR"]),
  latitude: z.number(),
  longitude: z.number(),
  radiusMeters: z.number().min(100).max(50000),
  startsAt: z.string().datetime(),
  media: z.array(z.object({
    type: z.enum(["IMAGE", "VIDEO", "VOICE"]),
    objectKey: z.string()
  })).optional()
});

export const feedQuerySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  radiusMeters: z.number().min(100).max(50000),
  mode: z.enum(["MY_LOCATION", "GENERAL"]),
  limit: z.number().min(1).max(100).optional()
});

export const chatMessageSchema = z.object({
  ciphertext: z.string(),
  nonce: z.string(),
  ratchetHeader: z.string(),
  senderKeyId: z.string()
});

export const escrowActionSchema = z.object({
  contractId: z.string(),
  action: z.enum(["FUND", "RELEASE", "REFUND", "DISPUTE"]),
  reason: z.string().optional(),
  evidence: z.array(z.object({
    type: z.enum(["IMAGE", "VIDEO", "TEXT"]),
    content: z.string()
  })).optional()
});
