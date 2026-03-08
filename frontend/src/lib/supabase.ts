import { createBrowserClient } from "@supabase/ssr";
import type { User, Session } from "@supabase/supabase-js";

// Type for our custom user data that extends Supabase User
export interface GigsUser {
  id: string;
  email: string;
  phone?: string;
  displayName?: string;
  campusId?: string;
  role: string;
  emailConfirmed: boolean;
  createdAt: string;
}

// Create browser client for client-side usage
export function createClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL || "https://ubfkehylomrqxejgahjk.supabase.co",
    import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZmtlaHlsb21ycXhlamdhaGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODI0NzIsImV4cCI6MjA4ODU1ODQ3Mn0.PK5Kp0wug96Vr-quCTFL9kdDb8SjEhdI6wjmICKYbj0"
  );
}

// Auth helper functions
export async function signUpWithEmail(
  supabase: ReturnType<typeof createClient>,
  email: string,
  password: string,
  options?: {
    displayName?: string;
    campusId?: string;
    phone?: string;
    redirectTo?: string;
  }
) {
  const redirectTo = options?.redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        display_name: options?.displayName || "",
        campus_id: options?.campusId || "",
        phone: options?.phone || "",
      },
    },
  });

  if (error) throw error;
  return { data, error };
}

export async function signInWithEmail(
  supabase: ReturnType<typeof createClient>,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return { data, error };
}

export async function signOut(supabase: ReturnType<typeof createClient>) {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(
  supabase: ReturnType<typeof createClient>,
  email: string,
  redirectTo?: string
) {
  const targetUrl = redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : '');
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: targetUrl,
  });

  if (error) throw error;
}

export async function updatePassword(
  supabase: ReturnType<typeof createClient>,
  newPassword: string
) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
  return data;
}

export async function signInWithOAuth(
  supabase: ReturnType<typeof createClient>,
  provider: "google" | "github",
  redirectTo?: string
) {
  const targetUrl = redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: targetUrl,
    },
  });

  if (error) throw error;
  return data;
}

export async function getSession(supabase: ReturnType<typeof createClient>) {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getUser(supabase: ReturnType<typeof createClient>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function refreshSession(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data;
}

export async function verifyEmail(
  supabase: ReturnType<typeof createClient>,
  _token: string
) {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Check if user email is confirmed
export function isEmailConfirmed(user: User | null): boolean {
  return user?.email_confirmed_at !== undefined && user.email_confirmed_at !== null;
}

// Get user metadata
export function getUserMetadata(user: User | null): Record<string, unknown> {
  return user?.user_metadata || {};
}

// Format user for our app
export function formatGigsUser(user: User): GigsUser {
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email || "",
    phone: metadata.phone as string | undefined,
    displayName: metadata.display_name as string | undefined,
    campusId: metadata.campus_id as string | undefined,
    role: (metadata.role as string) || "STUDENT",
    emailConfirmed: isEmailConfirmed(user),
    createdAt: user.created_at,
  };
}

// Auth state listener
export function onAuthStateChange(
  supabase: ReturnType<typeof createClient>,
  callback: (event: string, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

// Export default client
export const supabase = createClient();

