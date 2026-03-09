import { useEffect, useState, useMemo, FormEvent, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye, EyeOff, LoaderCircle, Briefcase, ShieldCheck,
  KeyRound, Mail, Lock, Phone, BadgeCheck, UserRound,
  ArrowRight, CheckCircle, AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../state/authStore";
import { useThemeStore, ThemeName, THEME_OPTIONS } from "../state/themeStore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { createClient } from "../lib/supabase";
import { getPasswordChecks, getErrorMessage } from "../lib/utils";
import { emailPattern, phonePattern } from "../lib/patterns";
import { DotsLoader } from "../components/DotsLoader";
import type { User } from "@supabase/supabase-js";

type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";
interface AuthState { mode: AuthMode; verifyToken: string; resetToken: string; }

const supabase = createClient();

function formatGigsUser(user: User) {
  const metadata = user.user_metadata || {};
  return {
    id: user.id, email: user.email || "",
    phone: metadata.phone as string | undefined,
    displayName: metadata.display_name as string | undefined,
    campusId: metadata.campus_id as string | undefined,
    role: (metadata.role as string) || "STUDENT",
    emailConfirmed: !!user.email_confirmed_at,
    createdAt: user.created_at,
  };
}

function parseAuthState(search: string): AuthState {
  const params = new URLSearchParams(search);
  const mode = params.get("mode");
  const token = params.get("token")?.trim() ?? "";
  if (mode === "verify" && token) return { mode: "verify", verifyToken: token, resetToken: "" };
  if (mode === "reset" && token) return { mode: "reset", verifyToken: "", resetToken: token };
  return { mode: "login", verifyToken: "", resetToken: "" };
}

/* ── Password checklist ─────────────────────────────────────────── */
function PasswordChecklist({ value }: { value: string }) {
  const checks = useMemo(() => getPasswordChecks(value), [value]);
  const passed = checks.filter((item) => item.pass).length;
  const barColor = (["#ef4444", "#f97316", "#eab308", "#06b6d4", "#10b981"])[Math.min(passed - 1, 4)] ?? "#e5e7eb";
  return (
    <div className="pro-auth-password-box">
      <div className="pro-auth-password-head">
        <span>Password strength</span>
        <strong>{passed}/4</strong>
      </div>
      <div className="pro-auth-password-meter">
        {checks.map((item, i) => (
          <span key={item.label} className="pro-auth-password-meter-bar"
            style={{ background: i < passed ? barColor : "#e5e7eb", transition: "background 0.3s" }} />
        ))}
      </div>
      <ul className="pro-auth-password-checks">
        {checks.map((item) => (
          <li key={item.label} className={item.pass ? "is-pass" : ""}>
            <BadgeCheck size={12} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────────────── */
function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="pro-auth-field">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

/* ── Input wrapper ──────────────────────────────────────────────── */
function TextInput({ id, icon, children }: { id: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="pro-auth-input-wrap" id={`${id}-wrap`}>
      {icon}
      {children}
    </div>
  );
}

/* ── Right visual panel ─────────────────────────────────────────── */
function RightPanel() {
  return (
    <div className="pro-auth-visual">
      <div className="pro-auth-visual-grid" />
      <div className="pro-auth-visual-blob pro-auth-visual-blob--tl" />
      <div className="pro-auth-visual-blob pro-auth-visual-blob--br" />

      {/* top-right float */}
      <motion.div className="pro-auth-float pro-auth-float--tr"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <span className="pro-auth-float-dot" />
        <div>
          <p className="pro-auth-float-title">New gig request</p>
          <p className="pro-auth-float-sub">Office Cleaning · Westlands</p>
        </div>
        <strong className="pro-auth-float-amount">KSh 2,500</strong>
      </motion.div>

      {/* centre */}
      <div className="pro-auth-visual-center">
        <div className="pro-auth-visual-icon">
          <Briefcase size={30} color="#06b6d4" />
        </div>
        <h2 className="pro-auth-visual-headline">
          Kenya's #1<br /><span>Campus Gig</span><br />Platform
        </h2>
        <p className="pro-auth-visual-tagline">Earn on your schedule, get paid instantly via M-PESA.</p>
        <div className="pro-auth-visual-features">
          {[{ e: "⚡", t: "Instant M-PESA payouts" }, { e: "✅", t: "Verified campus workers" }, { e: "🔒", t: "Secure escrow protection" }].map((f) => (
            <div key={f.t} className="pro-auth-visual-feature">
              <span className="pro-auth-visual-feature-icon">{f.e}</span>
              <span>{f.t}</span>
            </div>
          ))}
        </div>
        <div className="pro-auth-visual-stats">
          {[["10K+", "Gigs"], ["5K+", "Workers"], ["98%", "Rating"]].map(([v, l]) => (
            <div key={l} className="pro-auth-visual-stat">
              <strong>{v}</strong><span>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* bottom-left float */}
      <motion.div className="pro-auth-float pro-auth-float--bl"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}>
        <span className="pro-auth-float-emoji">💰</span>
        <div>
          <p className="pro-auth-float-sub">Payment sent</p>
          <strong className="pro-auth-float-pay">+ KSh 1,800</strong>
        </div>
      </motion.div>
    </div>
  );
}

/* ── MAIN ───────────────────────────────────────────────────────── */
export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession, setUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const parsed = useMemo(() => parseAuthState(location.search), [location.search]);

  const [mode, setMode] = useState<AuthMode>(parsed.mode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [showPassword, setShowPassword] = useState({ login: false, register: false, reset: false });

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "", rememberMe: true });
  const [registerForm, setRegisterForm] = useState({ displayName: "", campusEmail: "", phone: "", campusId: "", password: "", confirmPassword: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({ token: parsed.resetToken, password: "", confirmPassword: "" });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const gigsUser = formatGigsUser(session.user);
        setUser(gigsUser as any);
        setSession({ accessToken: session.access_token, refreshToken: session.refresh_token, user: gigsUser as any });
      }
    });
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const gigsUser = formatGigsUser(session.user);
        setUser(gigsUser as any);
        setSession({ accessToken: session.access_token, refreshToken: session.refresh_token, user: gigsUser as any });
        navigate("/app", { replace: true });
      }
    };
    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate, setSession, setUser]);

  function switchMode(nextMode: AuthMode, options?: { preserveFeedback?: boolean }) {
    setMode(nextMode);
    if (!options?.preserveFeedback) { setErrorMessage(null); setSuccessMessage(null); }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginForm.identifier.trim().toLowerCase();
    if (!email || !loginForm.password) { setErrorMessage("Email and password are required."); return; }
    if (!emailPattern.test(email)) { setErrorMessage("Use a valid email address."); return; }
    try {
      setIsSubmitting(true); setErrorMessage(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: loginForm.password });
      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials")) {
          setErrorMessage("Please verify your email first. Check your inbox for the confirmation link.");
          setPendingEmail(email); return;
        }
        throw error;
      }
      if (data.user && !data.user.email_confirmed_at) {
        setErrorMessage("Please verify your email before logging in.");
        setPendingEmail(email); await supabase.auth.signOut(); return;
      }
      const gigsUser = formatGigsUser(data.user);
      setSuccessMessage("Login successful!");
      setSession({ accessToken: data.session?.access_token || "", refreshToken: data.session?.refresh_token || "", user: gigsUser as any });
      navigate("/app", { replace: true });
    } catch (error: any) { setErrorMessage(getErrorMessage(error, "Login failed. Please try again.")); }
    finally { setIsSubmitting(false); }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = registerForm.campusEmail.trim().toLowerCase();
    const phone = registerForm.phone.trim();
    if (!registerForm.displayName.trim() || !registerForm.campusId.trim()) { setErrorMessage("Display name and campus ID are required."); return; }
    if (!emailPattern.test(email)) { setErrorMessage("Use a valid email address."); return; }
    if (!phonePattern.test(phone)) { setErrorMessage("Use phone format like +2547XXXXXXXX."); return; }
    if (getPasswordChecks(registerForm.password).some((c) => !c.pass)) { setErrorMessage("Password does not meet required strength."); return; }
    if (registerForm.password !== registerForm.confirmPassword) { setErrorMessage("Password confirmation does not match."); return; }
    try {
      setIsSubmitting(true); setErrorMessage(null);
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";
      const { data, error } = await supabase.auth.signUp({
        email, password: registerForm.password,
        options: { emailRedirectTo: redirectTo, data: { display_name: registerForm.displayName.trim(), campus_id: registerForm.campusId.trim(), phone } },
      });
      if (error) {
        const m = error.message || "";
        if (m.includes("already been registered") || m.includes("already exists")) {
          setErrorMessage("An account with this email already exists. Please sign in instead.");
          switchMode("login", { preserveFeedback: true }); return;
        }
        throw error;
      }
      setPendingEmail(email);
      if (data.user && !data.session) {
        setSuccessMessage("Account created! Please check your email to verify before logging in.");
        setTimeout(() => { switchMode("login", { preserveFeedback: true }); setLoginForm((c) => ({ ...c, identifier: email, password: "" })); }, 3000);
      } else if (data.session) {
        const gigsUser = formatGigsUser(data.user!);
        setSession({ accessToken: data.session.access_token, refreshToken: data.session.refresh_token, user: gigsUser as any });
        navigate("/app", { replace: true });
      }
    } catch (error: any) { setErrorMessage(getErrorMessage(error, "Registration failed. Please try again.")); }
    finally { setIsSubmitting(false); }
  }

  async function onVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("Please check your email for the confirmation link and click it to verify your account.");
  }

  async function onForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = forgotEmail.trim().toLowerCase();
    if (!emailPattern.test(email)) { setErrorMessage("Use a valid email address."); return; }
    try {
      setIsSubmitting(true); setErrorMessage(null);
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setSuccessMessage("Password reset instructions have been sent to your email.");
      setTimeout(() => switchMode("login", { preserveFeedback: true }), 3000);
    } catch { setSuccessMessage("If the account exists, password reset instructions have been sent to your email."); }
    finally { setIsSubmitting(false); }
  }

  async function onReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (getPasswordChecks(resetForm.password).some((c) => !c.pass)) { setErrorMessage("Password does not meet required strength."); return; }
    if (resetForm.password !== resetForm.confirmPassword) { setErrorMessage("Password confirmation does not match."); return; }
    setErrorMessage("Please use the password reset link from your email to reset your password.");
  }

  const submittingText = isSubmitting ? <LoaderCircle className="spin" size={16} /> : null;

  /* ── Apple & Google SVGs ─────────────────────────────────────── */
  const AppleSvg = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
  const GoogleSvg = () => (
    <svg width="13" height="13" viewBox="0 0 24 24">
      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <>
      <DotsLoader />
      <main className="pro-auth-page">
        <div className="pro-auth-background">
          <motion.span className="pro-auth-orb pro-auth-orb--one" animate={{ y: [0, -26, 0], x: [0, 16, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          <motion.span className="pro-auth-orb pro-auth-orb--two" animate={{ y: [0, 20, 0], x: [0, -20, 0] }} transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut" }} />
      </div>
=======
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        /* ── PAGE ── */
        .pro-auth-page {
          min-height: 100vh;
          background: #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
        }
        /* ── OUTER CARD ── */
        .pro-auth-shell {
          width: 100%; max-width: 940px; min-height: 590px;
          background: white; border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.06);
          display: flex; overflow: hidden; position: relative;
        }

        /* ── LEFT FORM PANEL ── */
        .pro-auth-form-wrap {
          width: 415px; flex-shrink: 0;
          padding: 34px 36px 26px;
          display: flex; flex-direction: column;
          overflow-y: auto;
        }

        /* brand row */
        .pro-auth-brand-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 26px;
        }
        .pro-auth-brand-mark { display: flex; align-items: center; gap: 8px; }
        .pro-auth-brand-icon {
          width: 30px; height: 30px; border-radius: 7px; background: #06b6d4;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pro-auth-brand-name { font-size: 0.9rem; font-weight: 800; color: #111827; letter-spacing: -0.01em; }
        .pro-auth-theme-select {
          font-size: 0.7rem; font-weight: 600; color: #6b7280;
          background: white; border: 1px solid #e5e7eb; border-radius: 7px;
          padding: 5px 9px; font-family: inherit; cursor: pointer; outline: none;
        }

        /* shadcn card overrides — zero out all spacing */
        .pro-auth-card {
          border: none !important; box-shadow: none !important;
          background: transparent !important; padding: 0 !important;
          flex: 1; display: flex; flex-direction: column;
        }
        .pro-auth-card > [data-slot="card-header"] { padding: 0 0 14px !important; }
        .pro-auth-card [data-slot="card-title"] {
          font-size: 1.35rem !important; font-weight: 800 !important;
          color: #111827 !important; letter-spacing: -0.02em !important;
        }
        .pro-auth-card [data-slot="card-description"] {
          font-size: 0.8rem !important; color: #9ca3af !important; margin-top: 3px !important;
        }
        .pro-auth-card > [data-slot="card-content"] { padding: 0 !important; flex: 1; }
        .pro-auth-card > [data-slot="card-footer"] { padding: 14px 0 0 !important; }

        /* ── TABS ── */
        .pro-auth-tab-row {
          display: flex; background: #f3f4f6;
          border-radius: 10px; padding: 4px; margin-bottom: 16px; gap: 2px;
        }
        .pro-auth-tab-row button {
          flex: 1 !important; border-radius: 8px !important;
          font-size: 0.84rem !important; font-weight: 600 !important;
          padding: 8px 0 !important; transition: all 0.18s !important;
          font-family: inherit !important; height: auto !important;
        }
        .pro-auth-tab-row button[data-variant="default"],
        .pro-auth-tab-row button[class*="default"] {
          background: white !important; color: #111827 !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
        }
        .pro-auth-tab-row button[data-variant="ghost"],
        .pro-auth-tab-row button[class*="ghost"] {
          background: transparent !important; color: #9ca3af !important;
          box-shadow: none !important;
        }
        .pro-auth-tab-row button[data-variant="ghost"]:hover { color: #374151 !important; background: transparent !important; }

        /* ── FEEDBACK BANNERS ── */
        .pro-auth-feedback {
          display: flex; align-items: flex-start; gap: 7px;
          padding: 9px 12px; border-radius: 8px;
          font-size: 0.79rem; font-weight: 600;
          margin-bottom: 12px; line-height: 1.45;
        }
        .pro-auth-feedback svg { flex-shrink: 0; margin-top: 1px; }
        .pro-auth-feedback.is-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .pro-auth-feedback.is-error   { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

        /* ── FORM ── */
        .pro-auth-form { display: flex; flex-direction: column; gap: 11px; }
        .pro-auth-field { display: flex; flex-direction: column; gap: 4px; }
        .pro-auth-field label { font-size: 0.74rem !important; font-weight: 600 !important; color: #6b7280 !important; }

        /* 2-col grid */
        .pro-auth-row.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }

        /* ── INPUT WRAP ── */
        .pro-auth-input-wrap { position: relative; display: flex; align-items: center; }
        .pro-auth-input-wrap > svg:first-child {
          position: absolute; left: 10px; color: #9ca3af;
          pointer-events: none; z-index: 1; flex-shrink: 0;
        }
        .pro-auth-input-wrap input {
          padding-left: 32px !important; height: 40px !important;
          font-size: 0.875rem !important; border-radius: 10px !important;
          border: 1.5px solid #e5e7eb !important; background: #fafafa !important;
          font-family: inherit !important;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s !important;
          width: 100% !important;
        }
        .pro-auth-input-wrap input:focus {
          border-color: #06b6d4 !important;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.12) !important;
          background: white !important; outline: none !important;
        }
        .pro-auth-input-wrap input::placeholder { color: #c4c9d0 !important; }

        /* pw toggle */
        .pro-auth-icon-btn {
          position: absolute; right: 9px; background: none; border: none;
          cursor: pointer; color: #9ca3af; display: flex; padding: 0; z-index: 1;
          transition: color 0.15s;
        }
        .pro-auth-icon-btn:hover { color: #6b7280; }

        /* remember */
        .pro-auth-remember {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.77rem; color: #6b7280; cursor: pointer; user-select: none;
        }
        .pro-auth-remember input { accent-color: #06b6d4; width: 13px; height: 13px; }

        /* ── SUBMIT BUTTON ── */
        .pro-auth-form > button[type="submit"] {
          width: 100% !important; padding: 11px !important;
          border-radius: 10px !important; background: #06b6d4 !important;
          color: white !important; font-size: 0.9rem !important;
          font-weight: 700 !important; font-family: inherit !important;
          border: none !important; height: auto !important; cursor: pointer !important;
          display: flex !important; align-items: center !important;
          justify-content: center !important; gap: 7px !important;
          box-shadow: 0 2px 10px rgba(6,182,212,0.28) !important;
          transition: all 0.15s !important;
        }
        .pro-auth-form > button[type="submit"]:hover:not(:disabled) {
          background: #0891b2 !important; transform: translateY(-1px) !important;
          box-shadow: 0 6px 20px rgba(6,182,212,0.38) !important;
        }
        .pro-auth-form > button[type="submit"]:disabled {
          background: #e5e7eb !important; color: #9ca3af !important;
          box-shadow: none !important; cursor: not-allowed !important;
        }

        /* ── GHOST / BACK BUTTONS ── */
        .pro-auth-form .pro-auth-back-btn {
          background: none !important; border: none !important;
          color: #06b6d4 !important; font-size: 0.8rem !important;
          font-weight: 600 !important; font-family: inherit !important;
          cursor: pointer !important; padding: 0 !important;
          height: auto !important; text-align: center !important;
          box-shadow: none !important; width: fit-content !important;
          align-self: center !important; display: block !important;
          margin: 0 auto !important;
          transition: opacity 0.15s !important;
        }
        .pro-auth-form .pro-auth-back-btn:hover { opacity: 0.7 !important; }

        /* forgot link inline */
        .pro-auth-forgot-link {
          background: none; border: none; cursor: pointer;
          font-size: 0.77rem; font-weight: 600; color: #06b6d4;
          font-family: inherit; padding: 0;
          transition: opacity 0.15s;
        }
        .pro-auth-forgot-link:hover { opacity: 0.7; }

        /* ── DIVIDER ── */
        .pro-auth-divider {
          display: flex; align-items: center; gap: 10px; margin: 1px 0;
        }
        .pro-auth-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .pro-auth-divider-label { font-size: 0.68rem; color: #9ca3af; font-weight: 600; white-space: nowrap; }

        /* ── SOCIAL BUTTONS ── */
        .pro-auth-social-row { display: flex; gap: 10px; }
        .pro-auth-social-btn {
          flex: 1; padding: 9px 12px; border: 1.5px solid #e5e7eb;
          border-radius: 10px; background: white; font-family: inherit;
          font-size: 0.81rem; font-weight: 600; color: #374151;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 7px;
          transition: border-color 0.15s, background 0.15s;
        }
        .pro-auth-social-btn:hover { border-color: #06b6d4; background: rgba(6,182,212,0.04); }

        /* ── PASSWORD STRENGTH ── */
        .pro-auth-password-box {
          padding: 10px 12px; border-radius: 9px;
          background: #f9fafb; border: 1px solid #f3f4f6;
        }
        .pro-auth-password-head {
          display: flex; justify-content: space-between;
          font-size: 0.7rem; color: #6b7280; margin-bottom: 6px;
        }
        .pro-auth-password-head strong { color: #374151; }
        .pro-auth-password-meter { display: flex; gap: 4px; margin-bottom: 7px; }
        .pro-auth-password-meter-bar { flex: 1; height: 3px; border-radius: 9999; }
        .pro-auth-password-checks {
          list-style: none; padding: 0; margin: 0;
          display: grid; grid-template-columns: 1fr 1fr; gap: 3px 8px;
        }
        .pro-auth-password-checks li {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.67rem; color: #9ca3af;
        }
        .pro-auth-password-checks li svg { flex-shrink: 0; color: #d1d5db; }
        .pro-auth-password-checks li.is-pass { color: #374151; }
        .pro-auth-password-checks li.is-pass svg { color: #10b981; }

        /* ── INFO BOX ── */
        .pro-auth-info-box {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; text-align: center; padding: 18px 16px;
          border-radius: 12px; background: #f0f9ff;
          border: 1px solid #bae6fd; color: #0369a1;
        }
        .pro-auth-info-box svg { color: #0891b2; }
        .pro-auth-info-box p { font-size: 0.85rem; font-weight: 600; margin: 0; }
        .pro-auth-info-box p.small { font-size: 0.73rem; font-weight: 400; color: #0284c7; }

        /* ── PENDING EMAIL ── */
        .pro-auth-pending-email {
          display: flex; justify-content: center; gap: 5px;
          font-size: 0.77rem; color: #6b7280;
        }
        .pro-auth-pending-email strong { color: #111827; }

        /* ── FOOTER ── */
        .pro-auth-footer-text {
          font-size: 0.67rem; color: #9ca3af;
          text-align: center; line-height: 1.55; margin: 0;
        }

        /* ── SPINNER ── */
        .spin { animation: pro-auth-spin 0.7s linear infinite; }
        @keyframes pro-auth-spin { to { transform: rotate(360deg); } }

        /* ════════════════════════════════════════════════════════
           RIGHT VISUAL PANEL
        ════════════════════════════════════════════════════════ */
        .pro-auth-visual {
          flex: 1; position: relative;
          background: linear-gradient(145deg, #164e63 0%, #0c3444 100%);
          border-radius: 0 22px 22px 0;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .pro-auth-visual-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 26px 26px; pointer-events: none;
        }
        .pro-auth-visual-blob {
          position: absolute; border-radius: 50%;
          filter: blur(60px); pointer-events: none;
        }
        .pro-auth-visual-blob--tl { width: 260px; height: 260px; top: -60px; left: -60px; background: rgba(6,182,212,0.18); }
        .pro-auth-visual-blob--br { width: 220px; height: 220px; bottom: -40px; right: -40px; background: rgba(245,158,11,0.12); }

        .pro-auth-visual-center {
          position: relative; z-index: 1;
          text-align: center; padding: 0 28px;
        }
        .pro-auth-visual-icon {
          width: 66px; height: 66px; border-radius: 18px;
          background: rgba(6,182,212,0.2); border: 1px solid rgba(6,182,212,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
        }
        .pro-auth-visual-headline {
          font-size: 1.55rem; font-weight: 900; color: white;
          line-height: 1.25; letter-spacing: -0.02em; margin-bottom: 10px;
        }
        .pro-auth-visual-headline span { color: #06b6d4; }
        .pro-auth-visual-tagline {
          font-size: 0.81rem; color: rgba(255,255,255,0.44);
          line-height: 1.6; max-width: 200px;
          margin: 0 auto 26px;
        }
        .pro-auth-visual-features {
          display: flex; flex-direction: column; gap: 10px;
          text-align: left; max-width: 230px; margin: 0 auto 24px;
        }
        .pro-auth-visual-feature { display: flex; align-items: center; gap: 10px; }
        .pro-auth-visual-feature-icon {
          width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0;
          background: rgba(6,182,212,0.15);
          display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
        }
        .pro-auth-visual-feature span:last-child {
          font-size: 0.79rem; font-weight: 600; color: rgba(255,255,255,0.72);
        }
        .pro-auth-visual-stats {
          display: flex; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px;
        }
        .pro-auth-visual-stat {
          flex: 1; text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
        }
        .pro-auth-visual-stat:last-child { border-right: none; }
        .pro-auth-visual-stat strong { display: block; font-size: 1.1rem; font-weight: 900; color: #06b6d4; }
        .pro-auth-visual-stat span {
          font-size: 0.6rem; color: rgba(255,255,255,0.3);
          text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; display: block;
        }

        /* floating cards */
        .pro-auth-float {
          position: absolute; z-index: 2; background: white;
          border-radius: 12px; padding: 10px 14px;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        }
        .pro-auth-float--tr { top: 22px; right: 22px; }
        .pro-auth-float--bl { bottom: 22px; left: 22px; }
        .pro-auth-float-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; flex-shrink: 0; }
        .pro-auth-float-title { font-size: 0.71rem; font-weight: 700; color: #111827; margin: 0; }
        .pro-auth-float-sub   { font-size: 0.62rem; color: #6b7280; margin: 0; }
        .pro-auth-float-amount { font-size: 0.79rem; font-weight: 800; color: #06b6d4; margin-left: 4px; white-space: nowrap; }
        .pro-auth-float-emoji {
          width: 34px; height: 34px; border-radius: 9px; background: #d1fae5;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .pro-auth-float-pay { font-size: 0.88rem; font-weight: 800; color: #059669; }

        /* ── MOBILE ── */
        @media (max-width: 700px) {
          .pro-auth-visual { display: none !important; }
          .pro-auth-form-wrap { width: 100% !important; }
        }
      `}</style>

      <main className="pro-auth-page">
        <div className="pro-auth-shell">

          {/* ════ LEFT FORM ════ */}
          <section className="pro-auth-form-wrap">

            {/* Brand + theme selector */}
            <div className="pro-auth-brand-row">
              <div className="pro-auth-brand-mark">
                <div className="pro-auth-brand-icon"><Briefcase size={15} color="white" /></div>
                <span className="pro-auth-brand-name">Gigs Mtaani</span>
              </div>
              <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)}
                className="pro-auth-theme-select" aria-label="Theme selector">
                {THEME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <Card className="pro-auth-card">
              <CardHeader>
                <CardTitle>
                  {mode === "login" && "Welcome back"}
                  {mode === "register" && "Create an account"}
                  {mode === "verify" && "Check your email"}
                  {mode === "forgot" && "Reset password"}
                  {mode === "reset" && "New password"}
                </CardTitle>
                <CardDescription>
                  {mode === "login" && "Sign in to your Gigs Mtaani account"}
                  {mode === "register" && "Sign up and get 30 days free trial"}
                  {mode === "verify" && "A confirmation link was sent to your inbox"}
                  {mode === "forgot" && "Enter your email to receive reset instructions"}
                  {mode === "reset" && "Create a strong new password"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Toggle — login / register only */}
                {(mode === "login" || mode === "register") && (
                  <div className="pro-auth-tab-row">
                    <Button variant={mode === "login" ? "default" : "ghost"} size="sm" onClick={() => switchMode("login")}>Sign in</Button>
                    <Button variant={mode === "register" ? "default" : "ghost"} size="sm" onClick={() => switchMode("register")}>Create account</Button>
                  </div>
                )}

                {/* Feedback */}
                {successMessage && (
                  <p className="pro-auth-feedback is-success"><CheckCircle size={14} />{successMessage}</p>
                )}
                {errorMessage && (
                  <p className="pro-auth-feedback is-error"><AlertCircle size={14} />{errorMessage}</p>
                )}

                <AnimatePresence mode="wait" initial={false}>

                  {/* ── LOGIN ── */}
                  {mode === "login" && (
                    <motion.form key="login" className="pro-auth-form" onSubmit={onLogin}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}>
                      <Field label="Email" htmlFor="login-identifier">
                        <TextInput id="login-identifier" icon={<Mail size={14} />}>
                          <Input id="login-identifier" type="email" placeholder="name@example.com"
                            value={loginForm.identifier}
                            onChange={(e) => setLoginForm((c) => ({ ...c, identifier: e.target.value }))}
                            autoComplete="username" />
                        </TextInput>
                      </Field>
                      <Field label="Password" htmlFor="login-password">
                        <TextInput id="login-password" icon={<Lock size={14} />}>
                          <Input id="login-password" type={showPassword.login ? "text" : "password"}
                            placeholder="Enter your password" value={loginForm.password}
                            onChange={(e) => setLoginForm((c) => ({ ...c, password: e.target.value }))}
                            autoComplete="current-password" />
                          <button type="button" className="pro-auth-icon-btn"
                            onClick={() => setShowPassword((c) => ({ ...c, login: !c.login }))}
                            aria-label={showPassword.login ? "Hide password" : "Show password"}>
                            {showPassword.login ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </TextInput>
                      </Field>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label className="pro-auth-remember">
                          <input type="checkbox" checked={loginForm.rememberMe}
                            onChange={(e) => setLoginForm((c) => ({ ...c, rememberMe: e.target.checked }))} />
                          Keep me signed in
                        </label>
                        <button type="button" className="pro-auth-forgot-link" onClick={() => switchMode("forgot")}>
                          Forgot password?
                        </button>
                      </div>
                      <button type="submit" disabled={isSubmitting} className="pro-auth-submit-btn"
                        style={{
                          width: "100%", padding: "11px", borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "#06b6d4",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.9rem", fontWeight: 700, fontFamily: "inherit",
                          border: "none", cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 2px 10px rgba(6,182,212,0.28)",
                          transition: "all 0.15s",
                        }}>
                        {submittingText || <><span>Sign In</span><ArrowRight size={14} /></>}
                      </button>
                      <div className="pro-auth-divider">
                        <div className="pro-auth-divider-line" />
                        <span className="pro-auth-divider-label">or continue with</span>
                        <div className="pro-auth-divider-line" />
                      </div>
                      <div className="pro-auth-social-row">
                        <button type="button" className="pro-auth-social-btn"><AppleSvg /> Apple</button>
                        <button type="button" className="pro-auth-social-btn"><GoogleSvg /> Google</button>
                      </div>
                    </motion.form>
                  )}

                  {/* ── REGISTER ── */}
                  {mode === "register" && (
                    <motion.form key="register" className="pro-auth-form" onSubmit={onRegister}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.18 }}>
                      <div className="pro-auth-row two-col">
                        <Field label="Display name" htmlFor="register-name">
                          <TextInput id="register-name" icon={<UserRound size={14} />}>
                            <Input id="register-name" placeholder="Full name" value={registerForm.displayName}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, displayName: e.target.value }))} />
                          </TextInput>
                        </Field>
                        <Field label="Campus ID" htmlFor="register-id">
                          <TextInput id="register-id" icon={<BadgeCheck size={14} />}>
                            <Input id="register-id" placeholder="ADM/1234/26" value={registerForm.campusId}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, campusId: e.target.value }))} />
                          </TextInput>
                        </Field>
                      </div>
                      <div className="pro-auth-row two-col">
                        <Field label="Email" htmlFor="register-email">
                          <TextInput id="register-email" icon={<Mail size={14} />}>
                            <Input id="register-email" type="email" placeholder="name@example.com"
                              value={registerForm.campusEmail}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, campusEmail: e.target.value }))}
                              autoComplete="email" />
                          </TextInput>
                        </Field>
                        <Field label="Phone" htmlFor="register-phone">
                          <TextInput id="register-phone" icon={<Phone size={14} />}>
                            <Input id="register-phone" placeholder="+2547XXXXXXXX" value={registerForm.phone}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, phone: e.target.value }))}
                              autoComplete="tel" />
                          </TextInput>
                        </Field>
                      </div>
                      <Field label="Password" htmlFor="register-password">
                        <TextInput id="register-password" icon={<Lock size={14} />}>
                          <Input id="register-password" type={showPassword.register ? "text" : "password"}
                            placeholder="Create a strong password" value={registerForm.password}
                            onChange={(e) => setRegisterForm((c) => ({ ...c, password: e.target.value }))}
                            autoComplete="new-password" />
                          <button type="button" className="pro-auth-icon-btn"
                            onClick={() => setShowPassword((c) => ({ ...c, register: !c.register }))}
                            aria-label={showPassword.register ? "Hide password" : "Show password"}>
                            {showPassword.register ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </TextInput>
                      </Field>
                      <Field label="Confirm password" htmlFor="register-confirm">
                        <TextInput id="register-confirm" icon={<ShieldCheck size={14} />}>
                          <Input id="register-confirm" type={showPassword.register ? "text" : "password"}
                            placeholder="Confirm your password" value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm((c) => ({ ...c, confirmPassword: e.target.value }))}
                            autoComplete="new-password" />
                        </TextInput>
                      </Field>
                      {registerForm.password && <PasswordChecklist value={registerForm.password} />}
                      <button type="submit" disabled={isSubmitting}
                        style={{
                          width: "100%", padding: "11px", borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "#06b6d4",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.9rem", fontWeight: 700, fontFamily: "inherit",
                          border: "none", cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 2px 10px rgba(6,182,212,0.28)",
                          transition: "all 0.15s",
                        }}>
                        {submittingText || <><span>Create Account</span><ArrowRight size={14} /></>}
                      </button>
                      <div className="pro-auth-divider">
                        <div className="pro-auth-divider-line" />
                        <span className="pro-auth-divider-label">or continue with</span>
                        <div className="pro-auth-divider-line" />
                      </div>
                      <div className="pro-auth-social-row">
                        <button type="button" className="pro-auth-social-btn"><AppleSvg /> Apple</button>
                        <button type="button" className="pro-auth-social-btn"><GoogleSvg /> Google</button>
                      </div>
                    </motion.form>
                  )}

                  {/* ── VERIFY ── */}
                  {mode === "verify" && (
                    <motion.form key="verify" className="pro-auth-form" onSubmit={onVerify}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}>
                      <div className="pro-auth-info-box">
                        <Mail size={26} />
                        <p>Please check your email for the confirmation link.</p>
                        <p className="small">Click the link in the email to verify your account. You will be redirected back to the app.</p>
                      </div>
                      {pendingEmail && (
                        <div className="pro-auth-pending-email">
                          <span>Confirmation sent to:</span>
                          <strong>{pendingEmail}</strong>
                        </div>
                      )}
                      <Button variant="ghost" className="pro-auth-back-btn" onClick={() => switchMode("login")}>
                        ← Back to sign in
                      </Button>
                    </motion.form>
                  )}

                  {/* ── FORGOT ── */}
                  {mode === "forgot" && (
                    <motion.form key="forgot" className="pro-auth-form" onSubmit={onForgot}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}>
                      <Field label="Email" htmlFor="forgot-email">
                        <TextInput id="forgot-email" icon={<Mail size={14} />}>
                          <Input id="forgot-email" type="email" placeholder="name@example.com"
                            value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                            autoComplete="email" />
                        </TextInput>
                      </Field>
                      <button type="submit" disabled={isSubmitting}
                        style={{
                          width: "100%", padding: "11px", borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "#06b6d4",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.9rem", fontWeight: 700, fontFamily: "inherit",
                          border: "none", cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 2px 10px rgba(6,182,212,0.28)",
                          transition: "all 0.15s",
                        }}>
                        {submittingText || "Send Reset Link"}
                      </button>
                      <Button variant="ghost" className="pro-auth-back-btn" onClick={() => switchMode("login")}>
                        ← Back to sign in
                      </Button>
                    </motion.form>
                  )}

                  {/* ── RESET ── */}
                  {mode === "reset" && (
                    <motion.form key="reset" className="pro-auth-form" onSubmit={onReset}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}>
                      <Field label="New password" htmlFor="reset-password">
                        <TextInput id="reset-password" icon={<Lock size={14} />}>
                          <Input id="reset-password" type={showPassword.reset ? "text" : "password"}
                            placeholder="Create a new password" value={resetForm.password}
                            onChange={(e) => setResetForm((c) => ({ ...c, password: e.target.value }))}
                            autoComplete="new-password" />
                          <button type="button" className="pro-auth-icon-btn"
                            onClick={() => setShowPassword((c) => ({ ...c, reset: !c.reset }))}
                            aria-label={showPassword.reset ? "Hide password" : "Show password"}>
                            {showPassword.reset ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </TextInput>
                      </Field>
                      <Field label="Confirm new password" htmlFor="reset-confirm">
                        <TextInput id="reset-confirm" icon={<ShieldCheck size={14} />}>
                          <Input id="reset-confirm" type={showPassword.reset ? "text" : "password"}
                            placeholder="Repeat password" value={resetForm.confirmPassword}
                            onChange={(e) => setResetForm((c) => ({ ...c, confirmPassword: e.target.value }))}
                            autoComplete="new-password" />
                        </TextInput>
                      </Field>
                      {resetForm.password && <PasswordChecklist value={resetForm.password} />}
                      <button type="submit" disabled={isSubmitting}
                        style={{
                          width: "100%", padding: "11px", borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "#06b6d4",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.9rem", fontWeight: 700, fontFamily: "inherit",
                          border: "none", cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 2px 10px rgba(6,182,212,0.28)",
                          transition: "all 0.15s",
                        }}>
                        {submittingText || "Reset Password"}
                      </button>
                      <Button variant="ghost" className="pro-auth-back-btn" onClick={() => switchMode("login")}>
                        ← Back to sign in
                      </Button>
                    </motion.form>
                  )}

                </AnimatePresence>
              </CardContent>

              <CardFooter>
                <p className="pro-auth-footer-text">
                  By continuing, you agree to secure use and activity monitoring for account protection.
                </p>
              </CardFooter>
            </Card>
          </section>

          {/* ════ RIGHT VISUAL ════ */}
          <RightPanel />

                {mode === "reset" && (
                  <motion.form key="reset" className="pro-auth-form" onSubmit={onReset} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <div className="pro-auth-info-box">
                      <Lock size={24} />
                      <p>Reset your password using the link from your email.</p>
                    </div>
                    <Field label="New password" htmlFor="reset-password">
                      <TextInput id="reset-password" icon={<Lock size={16} />}>
                        <Input id="reset-password" type={showPassword.reset ? "text" : "password"} placeholder="Create a new password" value={resetForm.password} onChange={(event) => setResetForm((current) => ({ ...current, password: event.target.value }))} autoComplete="new-password" />
                        <button type="button" className="pro-auth-icon-btn" onClick={() => setShowPassword((current) => ({ ...current, reset: !current.reset }))} aria-label={showPassword.reset ? "Hide password" : "Show password"}>{showPassword.reset ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      </TextInput>
                    </Field>
                    <Field label="Confirm new password" htmlFor="reset-confirm"><TextInput id="reset-confirm" icon={<ShieldCheck size={16} />}><Input id="reset-confirm" type={showPassword.reset ? "text" : "password"} placeholder="Repeat password" value={resetForm.confirmPassword} onChange={(event) => setResetForm((current) => ({ ...current, confirmPassword: event.target.value }))} autoComplete="new-password" /></TextInput></Field>
                    <PasswordChecklist value={resetForm.password} />
                    <Button type="submit" disabled={isSubmitting}>{submittingText || "Reset password"}</Button>
                    <Button variant="ghost" onClick={() => switchMode("login")}>Back to sign in</Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
            <CardFooter>
              <p className="pro-auth-footer-text">By continuing, you agree to secure use and activity monitoring for account protection.</p>
            </CardFooter>
          </Card>
        </motion.section>
      </div>
    </main>
=======
        </div>
      </main>
    </>
  );
}
