import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config.js";
import { randomUUID } from "node:crypto";

// Types for Supabase auth
export interface SupabaseUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string | null;
  created_at: string;
  user_metadata: Record<string, unknown>;
  app_metadata: Record<string, unknown>;
  aud: string;
  role: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
  user_metadata: Record<string, unknown>;
}

// Create Supabase client for auth operations
function getSupabaseAuthClient(): SupabaseClient | null {
  if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) {
    console.warn("Supabase not configured for auth");
    return null;
  }

  return createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Verify Supabase JWT token
export async function verifySupabaseToken(
  accessToken: string
): Promise<SupabaseUser | null> {
  const client = getSupabaseAuthClient();
  if (!client) {
    console.warn("Supabase client not available for token verification");
    return null;
  }

  try {
    const { data, error } = await client.auth.getUser(accessToken);
    
    if (error) {
      console.error("Token verification failed:", error.message);
      return null;
    }

    return data.user as unknown as SupabaseUser;
  } catch (err) {
    console.error("Exception during token verification:", err);
    return null;
  }
}

// Extract token from Authorization header
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }
  
  return parts[1];
}

// Get user by ID from Supabase
export async function getUserById(userId: string): Promise<SupabaseUser | null> {
  const client = getSupabaseAuthClient();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.admin.getUserById(userId);
    
    if (error || !data.user) {
      return null;
    }

    return data.user as unknown as SupabaseUser;
  } catch {
    return null;
  }
}

// Create user in Supabase (admin operation)
export async function createSupabaseUser(
  email: string,
  password: string,
  userMetadata: Record<string, unknown>
): Promise<{ user: SupabaseUser | null; error: string | null }> {
  const client = getSupabaseAuthClient();
  if (!client) {
    return { user: null, error: "Supabase not configured" };
  }

  try {
    const { data, error } = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email verification
      user_metadata: userMetadata,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user as unknown as SupabaseUser, error: null };
  } catch (err) {
    return { user: null, error: "Failed to create user" };
  }
}

// Generate a custom token for API access (optional - for backward compatibility)
export async function generateCustomToken(
  userId: string,
  expiresIn: string = "1h"
): Promise<string | null> {
  const client = getSupabaseAuthClient();
  if (!client) return null;

  try {
    // Use admin API to generate a token
    const { data, error } = await client.auth.admin.generateLink({
      type: "magiclink",
      email: "unused@example.com", // This won't send email
    });

    if (error || !data) {
      // Fallback: create a simple JWT-like token for internal use
      return createFallbackToken(userId);
    }

    return null;
  } catch {
    return createFallbackToken(userId);
  }
}

// Fallback token creation for development/testing
function createFallbackToken(userId: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    iat: Date.now(),
    exp: Date.now() + 3600000, // 1 hour
  })).toString("base64url");
  const signature = Buffer.from("fallback-signature").toString("base64url");
  
  return `${header}.${payload}.${signature}`;
}

// Convert Supabase user to session format compatible with our app
export function convertToSessionUser(supabaseUser: SupabaseUser): {
  id: string;
  campusEmail: string;
  phoneE164: string;
  role: string;
  status: string;
  displayName: string;
  campusId: string;
  emailConfirmed: boolean;
  createdAt: string;
} {
  const metadata = supabaseUser.user_metadata || {};
  
  return {
    id: supabaseUser.id,
    campusEmail: supabaseUser.email,
    phoneE164: supabaseUser.phone || "",
    role: (metadata.role as string) || "STUDENT",
    status: supabaseUser.email_confirmed_at ? "ACTIVE" : "PENDING_VERIFICATION",
    displayName: (metadata.display_name as string) || supabaseUser.email.split("@")[0],
    campusId: (metadata.campus_id as string) || "",
    emailConfirmed: !!supabaseUser.email_confirmed_at,
    createdAt: supabaseUser.created_at,
  };
}

// Check if user has verified email
export function isEmailVerified(supabaseUser: SupabaseUser): boolean {
  return !!supabaseUser.email_confirmed_at;
}

// Middleware factory for Fastify
export function createSupabaseAuthMiddleware() {
  return async function supabaseAuth(
    request: { headers: { authorization?: string }; user?: AuthTokenPayload },
    reply: { unauthorized: (msg: string) => { code: (code: number) => { send: (body: object) => void } } }
  ) {
    const token = extractBearerToken(request.headers.authorization);
    
    if (!token) {
      return reply.unauthorized("Missing authorization token");
    }

    const user = await verifySupabaseToken(token);
    
    if (!user) {
      return reply.unauthorized("Invalid or expired token");
    }

    // Attach user to request
    (request as unknown as { user: AuthTokenPayload }).user = {
      sub: user.id,
      email: user.email,
      role: (user.user_metadata.role as string) || "STUDENT",
      user_metadata: user.user_metadata,
    };
  };
}

// Rate limiting helper (can be enhanced with Redis)
const failedAttempts = new Map<string, { count: number; lockedUntil: number | null }>();

export function checkRateLimit(identifier: string, maxAttempts: number = 5): boolean {
  const now = Date.now();
  const record = failedAttempts.get(identifier);
  
  if (!record) {
    failedAttempts.set(identifier, { count: 1, lockedUntil: null });
    return true;
  }
  
  if (record.lockedUntil && now < record.lockedUntil) {
    return false;
  }
  
  // Reset if lock expired
  if (record.lockedUntil && now >= record.lockedUntil) {
    failedAttempts.set(identifier, { count: 1, lockedUntil: null });
    return true;
  }
  
  record.count += 1;
  
  if (record.count >= maxAttempts) {
    record.lockedUntil = now + 30 * 60 * 1000; // Lock for 30 minutes
    return false;
  }
  
  return true;
}

export function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = failedAttempts.get(identifier);
  
  if (!record) {
    failedAttempts.set(identifier, { count: 1, lockedUntil: null });
    return;
  }
  
  record.count += 1;
  
  if (record.count >= 5) {
    record.lockedUntil = now + 30 * 60 * 1000;
  }
}

export function clearFailedAttempts(identifier: string) {
  failedAttempts.delete(identifier);
}

export default {
  verifySupabaseToken,
  extractBearerToken,
  getUserById,
  createSupabaseUser,
  generateCustomToken,
  convertToSessionUser,
  isEmailVerified,
  createSupabaseAuthMiddleware,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
};

