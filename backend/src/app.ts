import { randomUUID } from "node:crypto";
import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import sensible from "@fastify/sensible";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { config } from "./config.js";
import { hashPassword, randomToken, sha256, verifyPassword } from "./lib/security.js";
import { createGigSchema, loginSchema, registerSchema } from "./lib/schemas.js";

type UserRole = "STUDENT" | "ADMIN";
type UserStatus = "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DELETED";

type UserRecord = {
  id: string;
  campusEmail: string;
  phoneE164: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  displayName: string;
  campusId: string;
  createdAt: string;
  updatedAt: string;
  mfaEnabled: boolean;
};

type SessionUser = {
  id: string;
  campusEmail: string;
  phoneE164: string;
  role: UserRole;
  status: UserStatus;
  displayName: string;
  campusId: string;
  profile: {
    displayName: string;
    bio: string;
    campusId: string;
    skills: string[];
    ratingAvg: number;
    ratingCount: number;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

type RefreshTokenRecord = {
  id: string;
  userId: string;
  familyId: string;
  tokenHash: string;
  expiresAtMs: number;
  revoked: boolean;
  replacedByTokenHash: string | null;
};

type GigRecord = {
  id: string;
  title: string;
  description: string;
  category: string;
  payAmount: number;
  currency: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  startsAt: string;
  status: "OPEN" | "COMPLETED";
  posterId: string;
  createdAt: string;
};

type ChatMessageRecord = {
  id: string;
  threadId: string;
  senderId: string;
  ciphertext: string;
  nonce: string;
  ratchetHeader: string;
  senderKeyId: string;
  createdAt: string;
};

type WalletEntry = {
  id: string;
  entryType: string;
  direction: "CREDIT" | "DEBIT";
  amount: number;
  createdAt: string;
};

type WalletRecord = {
  id: string;
  currency: string;
  available: number;
  pending: number;
  ledgerEntries: WalletEntry[];
};

type AuthTokenPayload = {
  sub: string;
  role: UserRole;
  sessionId: string;
};

const usersById = new Map<string, UserRecord>();
const usersByEmail = new Map<string, UserRecord>();
const usersByPhone = new Map<string, UserRecord>();
const refreshTokens = new Map<string, RefreshTokenRecord>();
const walletsByUser = new Map<string, WalletRecord[]>();
const messagesByThread = new Map<string, ChatMessageRecord[]>();

const gigs: GigRecord[] = [];

const topupSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("KES")
});

const sosSchema = z.object({
  note: z.string().optional(),
  encryptedLocation: z.string().optional()
});

function toSeconds(input: string, fallback: number): number {
  const match = input.match(/^(\d+)([smhd])$/i);
  if (!match) return fallback;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit === "s") return value;
  if (unit === "m") return value * 60;
  if (unit === "h") return value * 3600;
  if (unit === "d") return value * 86400;
  return fallback;
}

const accessTtlSeconds = toSeconds(config.ACCESS_TOKEN_TTL, 600);
const refreshTtlSeconds = toSeconds(config.REFRESH_TOKEN_TTL, 30 * 24 * 3600);

function parseAllowedOrigins(input: string): string[] {
  const defaults = ["http://localhost:3000", "http://localhost:5173"];
  const configured = input
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return Array.from(new Set([...defaults, ...configured]));
}

function toSessionUser(user: UserRecord): SessionUser {
  return {
    id: user.id,
    campusEmail: user.campusEmail,
    phoneE164: user.phoneE164,
    role: user.role,
    status: user.status,
    displayName: user.displayName,
    campusId: user.campusId,
    profile: {
      displayName: user.displayName,
      bio: "",
      campusId: user.campusId,
      skills: [],
      ratingAvg: 5,
      ratingCount: 0,
      avatarUrl: null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  };
}

function issueDefaultWallets(userId: string): WalletRecord[] {
  const existing = walletsByUser.get(userId);
  if (existing) return existing;

  const wallets: WalletRecord[] = [
    {
      id: `wallet_${randomUUID()}`,
      currency: "KES",
      available: 0,
      pending: 0,
      ledgerEntries: []
    }
  ];

  walletsByUser.set(userId, wallets);
  return wallets;
}

function seedGigsIfEmpty(): void {
  if (gigs.length > 0) return;

  gigs.push({
    id: `gig_${randomUUID()}`,
    title: "Campus Delivery Run",
    description: "Deliver lunch orders to nearby hostels.",
    category: "DELIVERY",
    payAmount: 500,
    currency: "KES",
    latitude: -1.2921,
    longitude: 36.8219,
    radiusMeters: 1500,
    startsAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: "OPEN",
    posterId: "seed-system",
    createdAt: new Date().toISOString()
  });
}

async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify<AuthTokenPayload>();
  } catch {
    reply.unauthorized("Invalid or expired access token");
  }
}

function getCurrentUser(request: FastifyRequest): UserRecord | null {
  const userId = request.user?.sub;
  if (!userId) return null;
  return usersById.get(userId) ?? null;
}

async function issueAuthTokens(
  reply: FastifyReply,
  user: UserRecord,
  familyId?: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number; familyId: string }> {
  const sessionId = randomUUID();
  const accessToken = await reply.jwtSign(
    {
      sub: user.id,
      role: user.role,
      sessionId
    },
    {
      expiresIn: accessTtlSeconds,
      issuer: config.JWT_ISSUER,
      audience: config.JWT_AUDIENCE
    } as never
  );

  const rawRefreshToken = randomToken(48);
  const tokenHash = sha256(rawRefreshToken);
  const resolvedFamilyId = familyId ?? randomUUID();

  refreshTokens.set(tokenHash, {
    id: randomUUID(),
    userId: user.id,
    familyId: resolvedFamilyId,
    tokenHash,
    expiresAtMs: Date.now() + refreshTtlSeconds * 1000,
    revoked: false,
    replacedByTokenHash: null
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    expiresIn: accessTtlSeconds,
    familyId: resolvedFamilyId
  };
}

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger:
      config.NODE_ENV === "development"
        ? {
            transport: {
              target: "pino-pretty"
            }
          }
        : true
  });

  const allowedOrigins = parseAllowedOrigins(config.WEB_ORIGIN);

  seedGigsIfEmpty();

  await app.register(sensible);
  await app.register(cors, {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-Device-Id", "X-Device-Public-Key"],
    credentials: false
  });

  await app.register(helmet, {
    contentSecurityPolicy: false
  });

  await app.register(rateLimit, {
    global: true,
    max: 180,
    timeWindow: "1 minute"
  });

  await app.register(jwt, {
    secret: config.JWT_ACCESS_SECRET
  });

  app.addHook("onRequest", async (request) => {
    request.requestId = randomUUID();
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error({ err: error, requestId: request.requestId });

    const normalized = error as Error & { statusCode?: number };
    const statusCode = normalized.statusCode ?? 500;
    reply.status(statusCode).send({
      error: normalized.message || "Internal Server Error",
      requestId: request.requestId
    });
  });

  app.get("/health", async () => {
    return { status: "ok", ts: new Date().toISOString() };
  });

  app.get("/ready", async () => {
    return { status: "ready", db: "memory" };
  });

  app.post("/api/v1/auth/register", async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const campusEmail = parsed.data.campusEmail.trim().toLowerCase();
    const phone = parsed.data.phone.trim();

    if (usersByEmail.has(campusEmail) || usersByPhone.has(phone)) {
      return reply.conflict("Account already exists for this email or phone.");
    }

    const now = new Date().toISOString();
    const user: UserRecord = {
      id: randomUUID(),
      campusEmail,
      phoneE164: phone,
      passwordHash: await hashPassword(parsed.data.password),
      role: "STUDENT",
      status: "ACTIVE",
      displayName: parsed.data.displayName.trim(),
      campusId: parsed.data.campusId.trim(),
      createdAt: now,
      updatedAt: now,
      mfaEnabled: false
    };

    usersById.set(user.id, user);
    usersByEmail.set(user.campusEmail, user);
    usersByPhone.set(user.phoneE164, user);
    issueDefaultWallets(user.id);

    return reply.code(201).send({
      user: toSessionUser(user),
      message: "Account created successfully."
    });
  });

  app.post("/api/v1/auth/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest(parsed.error.issues[0]?.message ?? "Invalid payload");
    }

    const identifier = parsed.data.identifier.trim().toLowerCase();
    const user = usersByEmail.get(identifier) ?? usersByPhone.get(parsed.data.identifier.trim());

    if (!user) {
      return reply.unauthorized("Invalid credentials");
    }

    const passwordOk = await verifyPassword(user.passwordHash, parsed.data.password);
    if (!passwordOk) {
      return reply.unauthorized("Invalid credentials");
    }

    if (user.status === "SUSPENDED" || user.status === "DELETED") {
      return reply.forbidden("Account is not active.");
    }

    const tokens = await issueAuthTokens(reply, user);

    return reply.send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      tokenType: "Bearer",
      expiresIn: tokens.expiresIn,
      user: toSessionUser(user)
    });
  });

  app.post<{ Body: { refreshToken?: string } }>("/api/v1/auth/refresh", async (request, reply) => {
    const rawRefreshToken = request.body?.refreshToken;
    if (!rawRefreshToken) {
      return reply.badRequest("refreshToken is required");
    }

    const tokenHash = sha256(rawRefreshToken);
    const token = refreshTokens.get(tokenHash);

    if (!token || token.revoked) {
      return reply.unauthorized("Invalid refresh token");
    }

    if (token.expiresAtMs < Date.now()) {
      return reply.unauthorized("Refresh token expired");
    }

    const user = usersById.get(token.userId);
    if (!user) {
      return reply.unauthorized("Invalid refresh token");
    }

    token.revoked = true;

    const next = await issueAuthTokens(reply, user, token.familyId);
    token.replacedByTokenHash = sha256(next.refreshToken);

    return reply.send({
      accessToken: next.accessToken,
      refreshToken: next.refreshToken,
      tokenType: "Bearer",
      expiresIn: next.expiresIn
    });
  });

  app.post<{ Body: { refreshToken?: string; familyId?: string } }>("/api/v1/auth/logout", async (request, reply) => {
    const { refreshToken, familyId } = request.body ?? {};

    if (!refreshToken && !familyId) {
      return reply.badRequest("Provide refreshToken or familyId");
    }

    if (refreshToken) {
      const tokenHash = sha256(refreshToken);
      const existing = refreshTokens.get(tokenHash);
      if (!existing) {
        return reply.send({ revoked: false });
      }

      for (const record of refreshTokens.values()) {
        if (record.familyId === existing.familyId) {
          record.revoked = true;
        }
      }

      return reply.send({ revoked: true, familyId: existing.familyId });
    }

    for (const record of refreshTokens.values()) {
      if (record.familyId === familyId) {
        record.revoked = true;
      }
    }

    return reply.send({ revoked: true, familyId });
  });

  app.get("/api/v1/auth/me", { preHandler: [authenticate] }, async (request, reply) => {
    const user = getCurrentUser(request);
    if (!user) {
      return reply.notFound("User not found");
    }

    return reply.send({ user: toSessionUser(user) });
  });

  app.get("/api/v1/gigs/feed", async () => {
    return {
      gigs: gigs
        .filter((gig) => gig.status === "OPEN")
        .map((gig) => ({
          ...gig,
          poster: {
            profile: {
              displayName: usersById.get(gig.posterId)?.displayName ?? "Campus User"
            }
          }
        }))
    };
  });

  app.post("/api/v1/gigs", { preHandler: [authenticate] }, async (request, reply) => {
    const parsed = createGigSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.badRequest(parsed.error.issues[0]?.message ?? "Invalid gig payload");
    }

    const user = getCurrentUser(request);
    if (!user) {
      return reply.unauthorized("Unauthorized");
    }

    const gig: GigRecord = {
      id: randomUUID(),
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      payAmount: parsed.data.payAmount,
      currency: parsed.data.currency,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      radiusMeters: parsed.data.radiusMeters,
      startsAt: parsed.data.startsAt,
      status: "OPEN",
      posterId: user.id,
      createdAt: new Date().toISOString()
    };

    gigs.unshift(gig);

    return reply.code(201).send({ gig });
  });

  app.post<{ Params: { id: string } }>("/api/v1/gigs/:id/apply", { preHandler: [authenticate] }, async (request) => {
    return { success: true, gigId: request.params.id };
  });

  app.get("/api/v1/gigs/mine/posted", { preHandler: [authenticate] }, async (request) => {
    const user = getCurrentUser(request);
    if (!user) {
      return { gigs: [] };
    }

    return {
      gigs: gigs.filter((gig) => gig.posterId === user.id)
    };
  });

  app.get("/api/v1/chat/threads", { preHandler: [authenticate] }, async () => {
    return { threads: [] };
  });

  app.get<{ Params: { threadId: string } }>(
    "/api/v1/chat/threads/:threadId/messages",
    { preHandler: [authenticate] },
    async (request) => {
      return {
        messages: messagesByThread.get(request.params.threadId) ?? []
      };
    }
  );

  app.post<{
    Params: { threadId: string };
    Body: { ciphertext?: string; nonce?: string; ratchetHeader?: string; senderKeyId?: string };
  }>("/api/v1/chat/threads/:threadId/messages", { preHandler: [authenticate] }, async (request, reply) => {
    const user = getCurrentUser(request);
    if (!user) {
      return reply.unauthorized("Unauthorized");
    }

    const { ciphertext, nonce, ratchetHeader, senderKeyId } = request.body ?? {};
    if (!ciphertext || !nonce || !ratchetHeader || !senderKeyId) {
      return reply.badRequest("ciphertext, nonce, ratchetHeader and senderKeyId are required");
    }

    const message: ChatMessageRecord = {
      id: randomUUID(),
      threadId: request.params.threadId,
      senderId: user.id,
      ciphertext,
      nonce,
      ratchetHeader,
      senderKeyId,
      createdAt: new Date().toISOString()
    };

    const existing = messagesByThread.get(request.params.threadId) ?? [];
    existing.push(message);
    messagesByThread.set(request.params.threadId, existing);

    return reply.code(201).send({ message });
  });

  app.get<{ Params: { userId: string } }>("/api/v1/chat/prekeys/:userId", { preHandler: [authenticate] }, async () => {
    return { keys: [] };
  });

  app.get("/api/v1/chat/ws", async (request, reply) => {
    return reply.code(426).send({
      error: "WebSocket upgrade endpoint is not enabled in this lightweight backend.",
      requestId: request.requestId
    });
  });

  app.get("/api/v1/escrow/wallet/me", { preHandler: [authenticate] }, async (request, reply) => {
    const user = getCurrentUser(request);
    if (!user) {
      return reply.unauthorized("Unauthorized");
    }

    return {
      wallets: issueDefaultWallets(user.id)
    };
  });

  app.post<{ Body: { amount?: number; currency?: string } }>(
    "/api/v1/escrow/wallet/topup",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const parsed = topupSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.badRequest(parsed.error.issues[0]?.message ?? "Invalid topup payload");
      }

      const user = getCurrentUser(request);
      if (!user) {
        return reply.unauthorized("Unauthorized");
      }

      const wallets = issueDefaultWallets(user.id);
      const wallet = wallets.find((item) => item.currency === parsed.data.currency) ?? wallets[0];

      wallet.available += parsed.data.amount;
      wallet.ledgerEntries.unshift({
        id: randomUUID(),
        entryType: "TOPUP",
        direction: "CREDIT",
        amount: parsed.data.amount,
        createdAt: new Date().toISOString()
      });

      return {
        wallet,
        wallets,
        success: true
      };
    }
  );

  app.get("/api/v1/safety/sessions/active", { preHandler: [authenticate] }, async () => {
    return {
      sessions: []
    };
  });

  app.post<{ Params: { sessionId: string }; Body: { note?: string; encryptedLocation?: string } }>(
    "/api/v1/safety/sessions/:sessionId/sos",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const parsed = sosSchema.safeParse(request.body ?? {});
      if (!parsed.success) {
        return reply.badRequest(parsed.error.issues[0]?.message ?? "Invalid SOS payload");
      }

      return {
        status: "ESCALATED",
        sessionId: request.params.sessionId,
        ...parsed.data
      };
    }
  );

  app.get("/api/v1/admin/metrics", { preHandler: [authenticate] }, async () => {
    return {
      totals: {
        totalUsers: usersById.size,
        activeGigs: gigs.filter((gig) => gig.status === "OPEN").length,
        completedToday: gigs.filter((gig) => gig.status === "COMPLETED").length,
        disputes: 0
      }
    };
  });

  app.get("/api/v1/risk/dashboard", { preHandler: [authenticate] }, async () => {
    return {
      counts: {
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: usersById.size
      }
    };
  });

  return app;
}
