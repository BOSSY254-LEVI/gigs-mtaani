import { z } from "zod";

export const registerSchema = z.object({
  campusEmail: z.string().email().min(5),
  phone: z.string().min(8).max(20),
  password: z.string().min(12).max(128),
  displayName: z.string().min(2).max(60),
  campusId: z.string().min(2).max(50)
});

export const loginSchema = z.object({
  identifier: z.string().min(2),
  password: z.string().min(12).max(128),
  mfaCode: z.string().length(6).optional()
});

export const createGigSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(20).max(5000),
  category: z.string().min(2).max(40),
  payAmount: z.number().positive(),
  currency: z.string().length(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().min(100).max(50000),
  startsAt: z.string().datetime(),
  media: z.array(z.object({
    type: z.enum(["IMAGE", "VIDEO", "VOICE"]),
    objectKey: z.string().min(5)
  })).max(8)
});

export const feedQuerySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().min(100).max(50000).default(5000),
  mode: z.enum(["MY_LOCATION", "GENERAL"]).default("MY_LOCATION"),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20)
});

export const chatMessageSchema = z.object({
  threadId: z.string().uuid(),
  ciphertext: z.string().min(10),
  nonce: z.string().min(10),
  ratchetHeader: z.string().min(10),
  senderKeyId: z.string().min(5),
  media: z.array(z.object({
    objectKey: z.string(),
    encryptedKeyForRecipient: z.string()
  })).optional()
});

export const escrowActionSchema = z.object({
  contractId: z.string().uuid(),
  action: z.enum(["FUND", "RELEASE", "REFUND", "OPEN_DISPUTE"]),
  reason: z.string().max(500).optional()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateGigInput = z.infer<typeof createGigSchema>;
export type FeedQueryInput = z.infer<typeof feedQuerySchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type EscrowActionInput = z.infer<typeof escrowActionSchema>;

