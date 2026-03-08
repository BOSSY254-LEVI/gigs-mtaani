import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config.js";

export type Database = {
  public: {
    Tables: {
      app_users: {
        Row: {
          id: string;
          campus_email: string;
          phone_e164: string;
          password_hash: string;
          role: "STUDENT" | "ADMIN" | "MODERATOR" | "RISK_OPS" | "FINANCE_OPS";
          status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DELETED";
          display_name: string;
          campus_id: string;
          mfa_enabled: boolean;
          failed_login_attempts: number;
          lockout_until: string | null;
          email_verified_at: string | null;
          email_verification_token: string | null;
          password_reset_token: string | null;
          password_reset_expires: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          campus_email: string;
          phone_e164: string;
          password_hash: string;
          display_name: string;
          campus_id: string;
          role?: "STUDENT" | "ADMIN" | "MODERATOR" | "RISK_OPS" | "FINANCE_OPS";
          status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DELETED";
          mfa_enabled?: boolean;
          failed_login_attempts?: number;
          lockout_until?: string | null;
          email_verified_at?: string | null;
          email_verification_token?: string | null;
          password_reset_token?: string | null;
          password_reset_expires?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campus_email?: string;
          phone_e164?: string;
          password_hash?: string;
          display_name?: string;
          campus_id?: string;
          role?: "STUDENT" | "ADMIN" | "MODERATOR" | "RISK_OPS" | "FINANCE_OPS";
          status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DELETED";
          mfa_enabled?: boolean;
          failed_login_attempts?: number;
          lockout_until?: string | null;
          email_verified_at?: string | null;
          email_verification_token?: string | null;
          password_reset_token?: string | null;
          password_reset_expires?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          bio: string;
          skills: string[];
          rating_avg: number;
          rating_count: number;
          avatar_url: string | null;
          cover_image_url: string | null;
          date_of_birth: string | null;
          gender: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          location_lat: number | null;
          location_lng: number | null;
          is_available: boolean;
          preferred_gigs: string[];
          hourly_rate: number | null;
          languages: string[];
          education: string | null;
          work_experience: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          bio?: string;
          skills?: string[];
          rating_avg?: number;
          rating_count?: number;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          is_available?: boolean;
          preferred_gigs?: string[];
          hourly_rate?: number | null;
          languages?: string[];
          education?: string | null;
          work_experience?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          bio?: string;
          skills?: string[];
          rating_avg?: number;
          rating_count?: number;
          avatar_url?: string | null;
          cover_image_url?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          location_lat?: number | null;
          location_lng?: number | null;
          is_available?: boolean;
          preferred_gigs?: string[];
          hourly_rate?: number | null;
          languages?: string[];
          education?: string | null;
          work_experience?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          email_notifications: boolean;
          push_notifications: boolean;
          sms_notifications: boolean;
          gig_alerts: boolean;
          marketing_emails: boolean;
          show_online_status: boolean;
          show_location: boolean;
          dark_mode: boolean;
          language: string;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
      };
      gigs: {
        Row: {
          id: string;
          poster_id: string;
          title: string;
          description: string;
          category: string;
          pay_amount: number;
          currency: string;
          latitude: number;
          longitude: number;
          radius_meters: number;
          starts_at: string;
          ends_at: string | null;
          status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";
          required_skills: string[];
          experience_level: string | null;
          estimated_duration: number | null;
          is_remote: boolean;
          location_description: string | null;
          media_urls: string[];
          applications_count: number;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          poster_id: string;
          title: string;
          description: string;
          category: string;
          pay_amount: number;
          currency: string;
          latitude: number;
          longitude: number;
          radius_meters: number;
          starts_at: string;
          ends_at?: string | null;
          status?: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";
          required_skills?: string[];
          experience_level?: string | null;
          estimated_duration?: number | null;
          is_remote?: boolean;
          location_description?: string | null;
          media_urls?: string[];
          applications_count?: number;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          poster_id?: string;
          title?: string;
          description?: string;
          category?: string;
          pay_amount?: number;
          currency?: string;
          latitude?: number;
          longitude?: number;
          radius_meters?: number;
          starts_at?: string;
          ends_at?: string | null;
          status?: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";
          required_skills?: string[];
          experience_level?: string | null;
          estimated_duration?: number | null;
          is_remote?: boolean;
          location_description?: string | null;
          media_urls?: string[];
          applications_count?: number;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      gig_applications: {
        Row: {
          id: string;
          gig_id: string;
          applicant_id: string;
          message: string | null;
          proposed_rate: number | null;
          status: string;
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          gig_id: string;
          applicant_id: string;
          message?: string | null;
          proposed_rate?: number | null;
          status?: string;
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gig_id?: string;
          applicant_id?: string;
          message?: string | null;
          proposed_rate?: number | null;
          status?: string;
          applied_at?: string;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          currency: string;
          available: number;
          pending: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          wallet_id: string;
          type: "TOPUP" | "PAYMENT" | "REFUND" | "WITHDRAWAL" | "FEE";
          direction: "CREDIT" | "DEBIT";
          amount: number;
          fee: number;
          description: string | null;
          reference_id: string | null;
          status: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
      };
      chat_threads: {
        Row: {
          id: string;
          gig_id: string | null;
          title: string | null;
          created_by: string;
          is_group: boolean;
          last_message_at: string;
          created_at: string;
          updated_at: string;
        };
      };
      thread_participants: {
        Row: {
          thread_id: string;
          user_id: string;
          joined_at: string;
          last_read_at: string;
          is_admin: boolean;
          muted: boolean;
        };
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          ciphertext: string;
          nonce: string;
          ratchet_header: string | null;
          sender_key_id: string | null;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
      };
      safety_sessions: {
        Row: {
          id: string;
          user_id: string;
          status: "ACTIVE" | "ESCALATED" | "ENDED";
          started_at: string;
          ended_at: string | null;
          check_in_code: string | null;
          last_check_in_at: string | null;
          note: string | null;
          emergency_contacts_notified: string[];
          location_lat: number | null;
          location_lng: number | null;
          created_at: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          metadata: Record<string, unknown>;
          ip_hash: string | null;
          user_agent: string | null;
          request_id: string | null;
          created_at: string;
        };
      };
      trust_scores: {
        Row: {
          user_id: string;
          score: number;
          band: "New" | "Verified" | "Trusted" | "Top Rated";
          total_transactions: number;
          successful_transactions: number;
          late_completions: number;
          cancellations: number;
          disputes: number;
          total_earnings: number;
          average_rating: number;
          rating_count: number;
          updated_at: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          gig_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          is_public: boolean;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Record<string, unknown>;
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
      };
    };
  };
  Views: {
    [_ in never]: never;
  };
  Functions: {
    [_ in never]: never;
  };
  Enums: {
    [_ in never]: never;
  };
};

let supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!config.SUPABASE_URL || !config.SUPABASE_SERVICE_KEY) {
    console.warn("Supabase not configured - running in demo mode");
    return null;
  }

  if (!supabase) {
    supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabase;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(config.SUPABASE_URL && config.SUPABASE_SERVICE_KEY);
}

// ============================================
// USER OPERATIONS
// ============================================

export async function createUser(userData: {
  id: string;
  campus_email: string;
  phone_e164: string;
  password_hash: string;
  display_name: string;
  campus_id: string;
  role?: "STUDENT" | "ADMIN";
  status?: "ACTIVE" | "PENDING_VERIFICATION";
}): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client.from("app_users").insert({
    id: userData.id,
    campus_email: userData.campus_email,
    phone_e164: userData.phone_e164,
    password_hash: userData.password_hash,
    display_name: userData.display_name,
    campus_id: userData.campus_id,
    role: userData.role || "STUDENT",
    status: userData.status || "PENDING_VERIFICATION",
    mfa_enabled: false,
    failed_login_attempts: 0,
  });

  if (error) {
    console.error("Failed to create user:", error);
    return false;
  }

  return true;
}

export async function getUserByEmail(email: string) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("app_users")
    .select("*")
    .eq("campus_email", email.toLowerCase())
    .single();

  if (error) return null;
  return data;
}

export async function getUserById(id: string) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("app_users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function updateUserVerification(userId: string, verified: boolean = true) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("app_users")
    .update({
      status: "ACTIVE",
      email_verified_at: verified ? new Date().toISOString() : null,
      email_verification_token: null,
    })
    .eq("id", userId);

  return !error;
}

export async function updateUserPassword(userId: string, newPasswordHash: string) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("app_users")
    .update({
      password_hash: newPasswordHash,
      failed_login_attempts: 0,
      lockout_until: null,
    })
    .eq("id", userId);

  return !error;
}

export async function recordFailedLogin(userId: string) {
  const client = getSupabase();
  if (!client) return;

  const user = await getUserById(userId);
  if (!user) return;

  const newAttempts = (user.failed_login_attempts || 0) + 1;
  const lockoutUntil = newAttempts >= 5 
    ? new Date(Date.now() + 30 * 60 * 1000).toISOString() 
    : null;

  await client
    .from("app_users")
    .update({
      failed_login_attempts: newAttempts,
      lockout_until: lockoutUntil,
    })
    .eq("id", userId);
}

export async function resetFailedLogin(userId: string) {
  const client = getSupabase();
  if (!client) return;

  await client
    .from("app_users")
    .update({
      failed_login_attempts: 0,
      lockout_until: null,
    })
    .eq("id", userId);
}

// ============================================
// USER PROFILE OPERATIONS
// ============================================

export async function getUserProfile(userId: string) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateUserProfile(userId: string, updates: Record<string, unknown>) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("user_profiles")
    .update(updates)
    .eq("id", userId);

  return !error;
}

// ============================================
// USER SETTINGS OPERATIONS
// ============================================

export async function getUserSettings(userId: string) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("user_settings")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateUserSettings(userId: string, settings: Record<string, unknown>) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("user_settings")
    .update(settings)
    .eq("id", userId);

  return !error;
}

// ============================================
// GIG OPERATIONS
// ============================================

export async function createGig(gigData: {
  poster_id: string;
  title: string;
  description: string;
  category: string;
  pay_amount: number;
  currency: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  starts_at: string;
  ends_at?: string;
  required_skills?: string[];
  experience_level?: string;
  estimated_duration?: number;
  location_description?: string;
}) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("gigs")
    .insert({
      ...gigData,
      status: "OPEN",
      media_urls: [],
      applications_count: 0,
      views_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to create gig:", error);
    return null;
  }

  return data;
}

export async function getGigById(gigId: string) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("gigs")
    .select("*, app_users!poster_id(display_name, campus_id)")
    .eq("id", gigId)
    .single();

  if (error) return null;
  return data;
}

export async function getGigsFeed(params: {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  mode: "MY_LOCATION" | "GENERAL";
  limit?: number;
  category?: string;
}) {
  const client = getSupabase();
  if (!client) return [];

  let query = client
    .from("gigs")
    .select(`
      *,
      poster:app_users!gigs_poster_id_fkey(id, display_name, campus_id)
    `)
    .eq("status", "OPEN");

  if (params.category && params.category !== "ALL") {
    query = query.eq("category", params.category);
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(params.limit || 50);

  if (error) {
    console.error("Failed to fetch gigs:", error);
    return [];
  }

  // Filter by distance for MY_LOCATION mode
  let gigs = data || [];
  if (params.mode === "MY_LOCATION") {
    gigs = gigs.filter((gig) => {
      const distance = calculateDistance(
        params.latitude,
        params.longitude,
        gig.latitude,
        gig.longitude
      );
      return distance <= params.radiusMeters;
    });
  }

  return gigs;
}

export async function incrementGigViews(gigId: string) {
  const client = getSupabase();
  if (!client) return;
  // Use direct update instead of RPC for simplicity
  const { data } = await client.from("gigs").select("views_count").eq("id", gigId).single();
  if (data) {
    await client.from("gigs").update({ views_count: (data.views_count || 0) + 1 }).eq("id", gigId);
  }
}

// ============================================
// GIG APPLICATION OPERATIONS
// ============================================

export async function applyForGig(applicationData: {
  gig_id: string;
  applicant_id: string;
  message?: string;
  proposed_rate?: number;
}) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("gig_applications")
    .insert({
      ...applicationData,
      status: "PENDING",
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to apply for gig:", error);
    return null;
  }

  // Increment applications count
  const { data: gig } = await client.from("gigs").select("applications_count").eq("id", applicationData.gig_id).single();
  if (gig) {
    await client.from("gigs").update({ applications_count: (gig.applications_count || 0) + 1 }).eq("id", applicationData.gig_id);
  }

  return data;
}

export async function getGigApplications(gigId: string) {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("gig_applications")
    .select(`
      *,
      applicant:app_users!gig_applications_applicant_id_fkey(id, display_name, campus_id)
    `)
    .eq("gig_id", gigId)
    .order("applied_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function getUserApplications(userId: string) {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("gig_applications")
    .select(`
      *,
      gig:gigs(*)
    `)
    .eq("applicant_id", userId)
    .order("applied_at", { ascending: false });

  if (error) return [];
  return data;
}

// ============================================
// WALLET OPERATIONS
// ============================================

export async function getUserWallet(userId: string, currency: string = "KES") {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .eq("currency", currency)
    .single();

  if (error) return null;
  return data;
}

export async function getWalletTransactions(walletId: string, limit: number = 20) {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("transactions")
    .select("*")
    .eq("wallet_id", walletId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}

export async function createWalletTransaction(transaction: {
  wallet_id: string;
  type: "TOPUP" | "PAYMENT" | "REFUND" | "WITHDRAWAL" | "FEE";
  direction: "CREDIT" | "DEBIT";
  amount: number;
  fee?: number;
  description?: string;
  reference_id?: string;
}) {
  const client = getSupabase();
  if (!client) return null;

  // Get wallet
  const { data: wallet } = await client
    .from("wallets")
    .select("available, pending")
    .eq("id", transaction.wallet_id)
    .single();

  if (!wallet) return null;

  // Update wallet balance
  const newAvailable = transaction.direction === "CREDIT"
    ? wallet.available + transaction.amount
    : wallet.available - transaction.amount;

  if (newAvailable < 0) return null; // Insufficient funds

  await client
    .from("wallets")
    .update({ available: newAvailable })
    .eq("id", transaction.wallet_id);

  // Create transaction record
  const { data, error } = await client
    .from("transactions")
    .insert({
      ...transaction,
      fee: transaction.fee || 0,
      status: "COMPLETED",
    })
    .select()
    .single();

  return error ? null : data;
}

// ============================================
// CHAT OPERATIONS
// ============================================

export async function createChatThread(threadData: {
  gig_id?: string;
  title?: string;
  created_by: string;
}) {
  const client = getSupabase();
  if (!client) return null;

  const { data: thread, error } = await client
    .from("chat_threads")
    .insert({
      ...threadData,
      is_group: false,
    })
    .select()
    .single();

  if (error || !thread) return null;

  // Add creator as participant
  await client.from("thread_participants").insert({
    thread_id: thread.id,
    user_id: threadData.created_by,
    is_admin: true,
  });

  return thread;
}

export async function addThreadParticipant(threadId: string, userId: string) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client.from("thread_participants").insert({
    thread_id: threadId,
    user_id: userId,
  });

  return !error;
}

export async function getUserThreads(userId: string) {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("chat_threads")
    .select(`
      *,
      participants:thread_participants(*),
      messages:messages(*)
    `)
    .contains("participants", [{ user_id: userId }])
    .order("last_message_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function sendMessage(messageData: {
  thread_id: string;
  sender_id: string;
  ciphertext: string;
  nonce: string;
  ratchet_header?: string;
  sender_key_id?: string;
}) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("messages")
    .insert(messageData)
    .select()
    .single();

  if (error) return null;

  // Update thread last_message_at
  await client
    .from("chat_threads")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", messageData.thread_id);

  return data;
}

// ============================================
// SAFETY SESSION OPERATIONS
// ============================================

export async function createSafetySession(sessionData: {
  user_id: string;
  location_lat?: number;
  location_lng?: number;
}) {
  const client = getSupabase();
  if (!client) return null;

  const checkInCode = Math.floor(100000 + Math.random() * 900000).toString();

  const { data, error } = await client
    .from("safety_sessions")
    .insert({
      ...sessionData,
      check_in_code: checkInCode,
      status: "ACTIVE",
    })
    .select()
    .single();

  return error ? null : data;
}

export async function endSafetySession(sessionId: string) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("safety_sessions")
    .update({
      status: "ENDED",
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  return !error;
}

export async function triggerSOS(sessionId: string, note?: string) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("safety_sessions")
    .update({
      status: "ESCALATED",
      note: note,
    })
    .eq("id", sessionId);

  return !error;
}

// ============================================
// ACTIVITY LOGGING
// ============================================

export async function logActivity(activity: {
  user_id?: string;
  action: string;
  metadata?: Record<string, unknown>;
  ip_hash?: string;
  user_agent?: string;
  request_id?: string;
}) {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client.from("activity_logs").insert({
    user_id: activity.user_id || null,
    action: activity.action,
    metadata: activity.metadata || {},
    ip_hash: activity.ip_hash || null,
    user_agent: activity.user_agent || null,
    request_id: activity.request_id || null,
  });

  if (error) {
    console.error("Failed to log activity:", error);
  }
}

// ============================================
// TRUST SCORE OPERATIONS
// ============================================

export async function getUserTrustScore(userId: string) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("trust_scores")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateTrustScore(userId: string, updates: Partial<Database["public"]["Tables"]["trust_scores"]["Row"]>) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("trust_scores")
    .update(updates)
    .eq("user_id", userId);

  return !error;
}

// ============================================
// NOTIFICATIONS
// ============================================

export async function createNotification(notification: {
  user_id: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
}) {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from("notifications")
    .insert(notification)
    .select()
    .single();

  return error ? null : data;
}

export async function getUserNotifications(userId: string, limit: number = 20) {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}

export async function markNotificationRead(notificationId: string) {
  const client = getSupabase();
  if (!client) return false;

  const { error } = await client
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId);

  return !error;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default {
  getSupabase,
  isSupabaseConfigured,
  createUser,
  getUserByEmail,
  getUserById,
  updateUserVerification,
  updateUserPassword,
  recordFailedLogin,
  resetFailedLogin,
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
  createGig,
  getGigById,
  getGigsFeed,
  incrementGigViews,
  applyForGig,
  getGigApplications,
  getUserApplications,
  getUserWallet,
  getWalletTransactions,
  createWalletTransaction,
  createChatThread,
  addThreadParticipant,
  getUserThreads,
  sendMessage,
  createSafetySession,
  endSafetySession,
  triggerSOS,
  logActivity,
  getUserTrustScore,
  updateTrustScore,
  createNotification,
  getUserNotifications,
  markNotificationRead,
};
