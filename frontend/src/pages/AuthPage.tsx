import { useEffect, useState, useMemo, FormEvent, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye, EyeOff, LoaderCircle, Briefcase, ShieldCheck,
  KeyRound, Mail, Lock, Phone, BadgeCheck, UserRound,
  ArrowRight, CheckCircle, AlertCircle, Sparkles,
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

// ==================== ANIMATED BACKGROUND ====================
function AnimatedBackground() {
  return (
    <div className="auth-animated-bg">
      <div className="auth-bg-shape auth-bg-shape-1"></div>
      <div className="auth-bg-shape auth-bg-shape-2"></div>
      <div className="auth-bg-shape auth-bg-shape-3"></div>
    </div>
  );
}

// ==================== FLOATING ELEMENTS ====================
function FloatingElements() {
  return (
    <>
      <motion.div
        className="auth-float-element float-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="float-card">
          <Sparkles size={16} color="#06b6d4" />
          <span>New gig available!</span>
        </div>
      </motion.div>
      <motion.div
        className="auth-float-element float-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="float-card success">
          <CheckCircle size={16} color="#10b981" />
          <span>Payment received</span>
        </div>
      </motion.div>
    </>
  );
}

// ==================== ENHANCED PASSWORD METER ====================
function EnhancedPasswordMeter({ value }: { value: string }) {
  const checks = useMemo(() => getPasswordChecks(value), [value]);
  const passed = checks.filter((item) => item.pass).length;
  
  const getColor = () => {
    if (passed <= 1) return "#ef4444";
    if (passed === 2) return "#f97316";
    if (passed === 3) return "#eab308";
    return "#10b981";
  };

  const getLabel = () => {
    if (passed <= 1) return "Weak";
    if (passed === 2) return "Fair";
    if (passed === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="enhanced-password-meter">
      <div className="meter-header">
        <span>Password strength</span>
        <motion.span
          key={getLabel()}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: getColor(), fontWeight: 700 }}
        >
          {getLabel()}
        </motion.span>
      </div>
      <div className="meter-bars">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            className="meter-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: level <= passed ? 1 : 0 }}
            transition={{ duration: 0.3, delay: level * 0.1 }}
            style={{ 
              backgroundColor: level <= passed ? getColor() : "#e5e7eb",
              transformOrigin: "left"
            }}
          />
        ))}
      </div>
      <ul className="meter-checks">
        {checks.map((item, i) => (
          <motion.li
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={item.pass ? "pass" : ""}
          >
            <motion.span
              animate={{ scale: item.pass ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.2 }}
            >
              {item.pass ? <CheckCircle size={12} /> : <div className="check-empty" />}
            </motion.span>
            {item.label}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

// ==================== ANIMATED INPUT ====================
function AnimatedInput({ 
  id, 
  icon, 
  children, 
  hasError = false 
}: { 
  id: string; 
  icon: ReactNode; 
  children: ReactNode; 
  hasError?: boolean;
}) {
  return (
    <div className={`animated-input-wrap ${hasError ? 'has-error' : ''}`}>
      {icon}
      {children}
      {hasError && (
        <div className="error-indicator">
          <AlertCircle size={14} />
        </div>
      )}
    </div>
  );
}

// ==================== SHAKE ERROR ====================
function ShakeError({ children, shake }: { children: React.ReactNode; shake: boolean }) {
  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

// ==================== CONFETTI SUCCESS ====================
function ConfettiSuccess({ show }: { show: boolean }) {
  if (!show) return null;
  
  return (
    <div className="auth-confetti">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="confetti-piece"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -20, 
            rotate: 0 
          }}
          animate={{ 
            y: window.innerHeight + 50, 
            x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200,
            rotate: Math.random() * 720 
          }}
          transition={{ 
            duration: 2 + Math.random() * 2, 
            ease: "easeOut" 
          }}
          style={{
            position: 'fixed',
            width: 8,
            height: 8,
            background: ["#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"][i % 5],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            left: 0,
            top: 0,
            zIndex: 9999
          }}
        />
      ))}
    </div>
  );
}

// ==================== THEME PREVIEW ====================
function ThemePreview({ theme }: { theme: ThemeName }) {
  const getThemeColors = (t: ThemeName) => {
    switch(t) {
      case 'dark': return { bg: '#1e293b', accent: '#06b6d4' };
      case 'ocean': return { bg: '#e0f2fe', accent: '#0ea5e9' };
      case 'sunset': return { bg: '#fff7ed', accent: '#f97316' };
      case 'forest': return { bg: '#f0fdf4', accent: '#22c55e' };
      default: return { bg: '#f8fafc', accent: '#06b6d4' };
    }
  };
  
  const colors = getThemeColors(theme);
  
  return (
    <motion.div 
      className="theme-preview"
      layoutId="theme-preview"
      style={{ background: colors.bg }}
    >
      <div style={{ background: colors.accent }} className="theme-preview-accent" />
    </motion.div>
  );
}

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

/* ── Field ──────────────────────────────────────────────────────── */
function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="pro-auth-field">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

/* ── Right visual panel ─────────────────────────────────────────── */
function RightPanel({ mode }: { mode: AuthMode }) {
  return (
    <div className="pro-auth-visual">
      <AnimatedBackground />
      <FloatingElements />
      <div className="pro-auth-visual-grid" />
      <div className="pro-auth-visual-blob pro-auth-visual-blob--tl" />
      <div className="pro-auth-visual-blob pro-auth-visual-blob--br" />

      {/* centre */}
      <div className="pro-auth-visual-center">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>
      </div>
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
  const [shakeError, setShakeError] = useState(false);
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);
  const [showThemePreview, setShowThemePreview] = useState(false);

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

  function triggerShake() {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 400);
  }

  function switchMode(nextMode: AuthMode, options?: { preserveFeedback?: boolean }) {
    setMode(nextMode);
    if (!options?.preserveFeedback) { setErrorMessage(null); setSuccessMessage(null); }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginForm.identifier.trim().toLowerCase();
    if (!email || !loginForm.password) { 
      setErrorMessage("Email and password are required."); 
      triggerShake();
      return; 
    }
    if (!emailPattern.test(email)) { 
      setErrorMessage("Use a valid email address."); 
      triggerShake();
      return; 
    }
    try {
      setIsSubmitting(true); setErrorMessage(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: loginForm.password });
      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials")) {
          setErrorMessage("Please verify your email first. Check your inbox for the confirmation link.");
          setPendingEmail(email); triggerShake();
          return;
        }
        throw error;
      }
      if (data.user && !data.user.email_confirmed_at) {
        setErrorMessage("Please verify your email before logging in.");
        setPendingEmail(email); await supabase.auth.signOut(); triggerShake();
        return;
      }
      const gigsUser = formatGigsUser(data.user);
      setSuccessMessage("Login successful!");
      setShowSuccessConfetti(true);
      setSession({ accessToken: data.session?.access_token || "", refreshToken: data.session?.refresh_token || "", user: gigsUser as any });
      setTimeout(() => navigate("/app", { replace: true }), 1500);
    } catch (error: any) { 
      setErrorMessage(getErrorMessage(error, "Login failed. Please try again.")); 
      triggerShake();
    }
    finally { setIsSubmitting(false); }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = registerForm.campusEmail.trim().toLowerCase();
    const phone = registerForm.phone.trim();
    if (!registerForm.displayName.trim() || !registerForm.campusId.trim()) { 
      setErrorMessage("Display name and campus ID are required."); 
      triggerShake();
      return; 
    }
    if (!emailPattern.test(email)) { 
      setErrorMessage("Use a valid email address."); 
      triggerShake();
      return; 
    }
    if (!phonePattern.test(phone)) { 
      setErrorMessage("Use phone format like +2547XXXXXXXX."); 
      triggerShake();
      return; 
    }
    if (getPasswordChecks(registerForm.password).some((c) => !c.pass)) { 
      setErrorMessage("Password does not meet required strength."); 
      triggerShake();
      return; 
    }
    if (registerForm.password !== registerForm.confirmPassword) { 
      setErrorMessage("Password confirmation does not match."); 
      triggerShake();
      return; 
    }
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
          switchMode("login", { preserveFeedback: true }); 
          triggerShake();
          return;
        }
        throw error;
      }
      setPendingEmail(email);
      if (data.user && !data.session) {
        setSuccessMessage("Account created! Please check your email to verify before logging in.");
        setShowSuccessConfetti(true);
        setTimeout(() => { switchMode("login", { preserveFeedback: true }); setLoginForm((c) => ({ ...c, identifier: email, password: "" })); }, 3000);
      } else if (data.session) {
        const gigsUser = formatGigsUser(data.user!);
        setSession({ accessToken: data.session.access_token, refreshToken: data.session.refresh_token, user: gigsUser as any });
        navigate("/app", { replace: true });
      }
    } catch (error: any) { 
      setErrorMessage(getErrorMessage(error, "Registration failed. Please try again.")); 
      triggerShake();
    }
    finally { setIsSubmitting(false); }
  }

  async function onVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("Please check your email for the confirmation link and click it to verify your account.");
  }

  async function onForgot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = forgotEmail.trim().toLowerCase();
    if (!emailPattern.test(email)) { 
      setErrorMessage("Use a valid email address."); 
      triggerShake();
      return; 
    }
    try {
      setIsSubmitting(true); setErrorMessage(null);
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      setSuccessMessage("Password reset instructions have been sent to your email.");
      setShowSuccessConfetti(true);
      setTimeout(() => switchMode("login", { preserveFeedback: true }), 3000);
    } catch { setSuccessMessage("If the account exists, password reset instructions have been sent to your email."); }
    finally { setIsSubmitting(false); }
  }

  async function onReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (getPasswordChecks(resetForm.password).some((c) => !c.pass)) { 
      setErrorMessage("Password does not meet required strength."); 
      triggerShake();
      return; 
    }
    if (resetForm.password !== resetForm.confirmPassword) { 
      setErrorMessage("Password confirmation does not match."); 
      triggerShake();
      return; 
    }
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
      <ConfettiSuccess show={showSuccessConfetti} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        /* Animated Background */
        .auth-animated-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 0 22px 22px 0;
        }

        .auth-bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }

        .auth-bg-shape-1 {
          width: 300px;
          height: 300px;
          background: #06b6d4;
          top: -50px;
          left: -50px;
          animation: floatBg 8s ease-in-out infinite;
        }

        .auth-bg-shape-2 {
          width: 250px;
          height: 250px;
          background: #f59e0b;
          bottom: -30px;
          right: -30px;
          animation: floatBg 10s ease-in-out infinite reverse;
        }

        .auth-bg-shape-3 {
          width: 200px;
          height: 200px;
          background: #10b981;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulseBg 6s ease-in-out infinite;
        }

        @keyframes floatBg {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        @keyframes pulseBg {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.5; }
        }

        /* Floating Elements */
        .auth-float-element {
          position: absolute;
          z-index: 10;
        }

        .float-1 { top: 15%; right: 20px; }
        .float-2 { bottom: 20%; left: 20px; }

        .float-card {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 10px 14px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
        }

        .float-card.success {
          background: #ecfdf5;
          color: #065f46;
        }

        /* Enhanced Password Meter */
        .enhanced-password-meter {
          padding: 14px;
          border-radius: 12px;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          margin-top: 8px;
        }

        .meter-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .meter-bars {
          display: flex;
          gap: 4px;
          margin-bottom: 10px;
        }

        .meter-bar {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          transform-origin: left;
        }

        .meter-checks {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .meter-checks li {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          color: #9ca3af;
        }

        .meter-checks li.pass {
          color: #10b981;
        }

        .check-empty {
          width: 12px;
          height: 12px;
          border: 1.5px solid #d1d5db;
          border-radius: 50%;
        }

        /* Animated Input */
        .animated-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .animated-input-wrap > svg:first-child {
          position: absolute;
          left: 10px;
          color: #9ca3af;
          pointer-events: none;
          z-index: 1;
          flex-shrink: 0;
        }

        .animated-input-wrap input {
          padding-left: 32px !important;
          height: 44px !important;
          font-size: 0.9rem !important;
          border-radius: 10px !important;
          border: 1.5px solid #e5e7eb !important;
          background: #fafafa !important;
          font-family: inherit !important;
          transition: all 0.2s !important;
          width: 100% !important;
        }

        .animated-input-wrap input:focus {
          border-color: #06b6d4 !important;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.15) !important;
          background: white !important;
          outline: none !important;
        }

        .animated-input-wrap.has-error input {
          border-color: #ef4444 !important;
          animation: shake 0.4s ease-in-out;
        }

        .error-indicator {
          position: absolute;
          right: 10px;
          color: #ef4444;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }

        /* Theme Preview */
        .theme-preview {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          z-index: 100;
          overflow: hidden;
        }

        .theme-preview-accent {
          width: 120px;
          height: 60px;
          border-radius: 8px;
        }

        /* ── PAGE ── */
        .pro-auth-page {
          min-height: 100vh;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── OUTER CARD ── */
        .pro-auth-shell {
          width: 100%;
          max-width: 960px;
          min-height: 600px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.15), 0 8px 30px rgba(0,0,0,0.1);
          display: flex;
          overflow: hidden;
          position: relative;
        }

        /* ── LEFT FORM PANEL ── */
        .pro-auth-form-wrap {
          width: 420px;
          flex-shrink: 0;
          padding: 32px 36px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        /* brand row */
        .pro-auth-brand-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          position: relative;
        }

        .pro-auth-brand-mark {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pro-auth-brand-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #06b6d4;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pro-auth-brand-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.01em;
        }

        .pro-auth-theme-select-wrapper {
          position: relative;
        }

        .pro-auth-theme-select {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 7px;
          padding: 6px 28px 6px 10px;
          font-family: inherit;
          cursor: pointer;
          outline: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          transition: all 0.2s;
        }

        .pro-auth-theme-select:hover {
          border-color: #06b6d4;
        }

        .pro-auth-theme-select:focus {
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6,182,212,0.1);
        }

        /* shadcn card overrides */
        .pro-auth-card {
          border: none !important;
          box-shadow: none !important;
          background: transparent !important;
          padding: 0 !important;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .pro-auth-card > [data-slot="card-header"] { padding: 0 0 14px !important; }
        .pro-auth-card [data-slot="card-title"] {
          font-size: 1.4rem !important;
          font-weight: 800 !important;
          color: #111827 !important;
          letter-spacing: -0.02em !important;
        }
        .pro-auth-card [data-slot="card-description"] {
          font-size: 0.82rem !important;
          color: #9ca3af !important;
          margin-top: 3px !important;
        }
        .pro-auth-card > [data-slot="card-content"] { padding: 0 !important; flex: 1; }
        .pro-auth-card > [data-slot="card-footer"] { padding: 14px 0 0 !important; }

        /* ── TABS ── */
        .pro-auth-tab-row {
          display: flex;
          background: #f3f4f6;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 16px;
          gap: 2px;
        }

        .pro-auth-tab-row button {
          flex: 1 !important;
          border-radius: 8px !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
          padding: 8px 0 !important;
          transition: all 0.2s !important;
          font-family: inherit !important;
          height: auto !important;
        }

        .pro-auth-tab-row button[data-variant="default"] {
          background: white !important;
          color: #111827 !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
        }

        .pro-auth-tab-row button[data-variant="ghost"] {
          background: transparent !important;
          color: #9ca3af !important;
          box-shadow: none !important;
        }

        .pro-auth-tab-row button[data-variant="ghost"]:hover { 
          color: #374151 !important; 
          background: transparent !important; 
        }

        /* ── FEEDBACK BANNERS ── */
        .pro-auth-feedback {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 14px;
          line-height: 1.45;
        }

        .pro-auth-feedback svg { flex-shrink: 0; margin-top: 1px; }
        .pro-auth-feedback.is-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; }
        .pro-auth-feedback.is-error   { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; }

        /* ── FORM ── */
        .pro-auth-form { display: flex; flex-direction: column; gap: 12px; }
        .pro-auth-field { display: flex; flex-direction: column; gap: 5px; }
        .pro-auth-field label { font-size: 0.75rem !important; font-weight: 600 !important; color: #6b7280 !important; }

        /* 2-col grid */
        .pro-auth-row.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* pw toggle */
        .pro-auth-icon-btn {
          position: absolute;
          right: 9px;
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          padding: 0;
          z-index: 1;
          transition: color 0.15s;
        }

        .pro-auth-icon-btn:hover { color: #6b7280; }

        /* remember */
        .pro-auth-remember {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #6b7280;
          cursor: pointer;
          user-select: none;
        }

        .pro-auth-remember input { accent-color: #06b6d4; width: 13px; height: 13px; }

        /* ── SUBMIT BUTTON ── */
        .pro-auth-form > button[type="submit"] {
          width: 100% !important;
          padding: 12px !important;
          border-radius: 10px !important;
          background: linear-gradient(135deg, #06b6d4, #0891b2) !important;
          color: white !important;
          font-size: 0.92rem !important;
          font-weight: 700 !important;
          font-family: inherit !important;
          border: none !important;
          height: auto !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 7px !important;
          box-shadow: 0 4px 15px rgba(6,182,212,0.3) !important;
          transition: all 0.2s !important;
        }

        .pro-auth-form > button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(6,182,212,0.4) !important;
        }

        .pro-auth-form > button[type="submit"]:disabled {
          background: #e5e7eb !important;
          color: #9ca3af !important;
          box-shadow: none !important;
          cursor: not-allowed !important;
        }

        /* ── GHOST / BACK BUTTONS ── */
        .pro-auth-form .pro-auth-back-btn {
          background: none !important;
          border: none !important;
          color: #06b6d4 !important;
          font-size: 0.8rem !important;
          font-weight: 600 !important;
          font-family: inherit !important;
          cursor: pointer !important;
          padding: 0 !important;
          height: auto !important;
          text-align: center !important;
          box-shadow: none !important;
          width: fit-content !important;
          align-self: center !important;
          display: block !important;
          margin: 0 auto !important;
        }

        /* forgot link inline */
        .pro-auth-forgot-link {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 600;
          color: #06b6d4;
          font-family: inherit;
          padding: 0;
        }

        .pro-auth-forgot-link:hover { opacity: 0.7; }

        /* ── DIVIDER ── */
        .pro-auth-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0;
        }

        .pro-auth-divider-line { flex: 1; height: 1px; background: #f3f4f6; }
        .pro-auth-divider-label { font-size: 0.7rem; color: #9ca3af; font-weight: 600; white-space: nowrap; }

        /* ── SOCIAL BUTTONS ── */
        .pro-auth-social-row { display: flex; gap: 10px; }

        .pro-auth-social-btn {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          font-family: inherit;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all 0.2s;
        }

        .pro-auth-social-btn:hover {
          border-color: #06b6d4;
          background: rgba(6,182,212,0.04);
          transform: translateY(-2px);
        }

        /* ── INFO BOX ── */
        .pro-auth-info-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
          padding: 20px 18px;
          border-radius: 14px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          color: #0369a1;
        }

        .pro-auth-info-box svg { color: #0891b2; }
        .pro-auth-info-box p { font-size: 0.88rem; font-weight: 600; margin: 0; }
        .pro-auth-info-box p.small { font-size: 0.75rem; font-weight: 400; color: #0284c7; }

        /* ── PENDING EMAIL ── */
        .pro-auth-pending-email {
          display: flex;
          justify-content: center;
          gap: 5px;
          font-size: 0.78rem;
          color: #6b7280;
        }

        .pro-auth-pending-email strong { color: #111827; }

        /* ── FOOTER ── */
        .pro-auth-footer-text {
          font-size: 0.68rem;
          color: #9ca3af;
          text-align: center;
          line-height: 1.55;
          margin: 0;
        }

        /* ── SPINNER ── */
        .spin { animation: pro-auth-spin 0.7s linear infinite; }
        @keyframes pro-auth-spin { to { transform: rotate(360deg); } }

        /* ════════════════════════════════════════════════════════
           RIGHT VISUAL PANEL
        ════════════════════════════════════════════════════════ */
        .pro-auth-visual {
          flex: 1;
          position: relative;
          background: linear-gradient(145deg, #164e63 0%, #0c3444 100%);
          border-radius: 0 22px 22px 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pro-auth-visual-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 26px 26px;
          pointer-events: none;
        }

        .pro-auth-visual-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .pro-auth-visual-blob--tl { 
          width: 280px; 
          height: 280px; 
          top: -70px; 
          left: -70px; 
          background: rgba(6,182,212,0.2); 
        }

        .pro-auth-visual-blob--br { 
          width: 240px; 
          height: 240px; 
          bottom: -50px; 
          right: -50px; 
          background: rgba(245,158,11,0.15); 
        }

        .pro-auth-visual-center {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 28px;
        }

        .pro-auth-visual-icon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          background: rgba(6,182,212,0.2);
          border: 1px solid rgba(6,182,212,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .pro-auth-visual-headline {
          font-size: 1.6rem;
          font-weight: 900;
          color: white;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }

        .pro-auth-visual-headline span { color: #06b6d4; }

        .pro-auth-visual-tagline {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          max-width: 210px;
          margin: 0 auto 28px;
        }

        .pro-auth-visual-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
          max-width: 240px;
          margin: 0 auto 26px;
        }

        .pro-auth-visual-feature { display: flex; align-items: center; gap: 10px; }

        .pro-auth-visual-feature-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          flex-shrink: 0;
          background: rgba(6,182,212,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .pro-auth-visual-feature span:last-child {
          font-size: 0.8rem;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
        }

        .pro-auth-visual-stats {
          display: flex;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 20px;
        }

        .pro-auth-visual-stat {
          flex: 1;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
        }

        .pro-auth-visual-stat:last-child { border-right: none; }

        .pro-auth-visual-stat strong {
          display: block;
          font-size: 1.15rem;
          font-weight: 900;
          color: #06b6d4;
        }

        .pro-auth-visual-stat span {
          font-size: 0.62rem;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-top: 3px;
          display: block;
        }

        /* ── MOBILE ── */
        @media (max-width: 720px) {
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
                <div className="pro-auth-brand-icon"><Briefcase size={16} color="white" /></div>
                <span className="pro-auth-brand-name">Gigs Mtaani</span>
              </div>
              <div className="pro-auth-theme-select-wrapper">
                <select 
                  value={theme} 
                  onChange={(e) => setTheme(e.target.value as ThemeName)}
                  onMouseEnter={() => setShowThemePreview(true)}
                  onMouseLeave={() => setShowThemePreview(false)}
                  className="pro-auth-theme-select" 
                  aria-label="Theme selector"
                >
                  {THEME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {showThemePreview && <ThemePreview theme={theme} />}
              </div>
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
                <ShakeError shake={shakeError}>
                  {successMessage && (
                    <motion.p 
                      className="pro-auth-feedback is-success"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CheckCircle size={14} />{successMessage}
                    </motion.p>
                  )}
                  {errorMessage && (
                    <motion.p 
                      className="pro-auth-feedback is-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle size={14} />{errorMessage}
                    </motion.p>
                  )}
                </ShakeError>

                <AnimatePresence mode="wait" initial={false}>

                  {/* ── LOGIN ── */}
                  {mode === "login" && (
                    <motion.form 
                      key="login" 
                      className="pro-auth-form" 
                      onSubmit={onLogin}
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Field label="Email" htmlFor="login-identifier">
                        <AnimatedInput id="login-identifier" icon={<Mail size={15} />} hasError={!!errorMessage && shakeError}>
                          <Input 
                            id="login-identifier" 
                            type="email" 
                            placeholder="name@example.com"
                            value={loginForm.identifier}
                            onChange={(e) => setLoginForm((c) => ({ ...c, identifier: e.target.value }))}
                            autoComplete="username" 
                          />
                        </AnimatedInput>
                      </Field>
                      <Field label="Password" htmlFor="login-password">
                        <AnimatedInput id="login-password" icon={<Lock size={15} />} hasError={!!errorMessage && shakeError}>
                          <Input 
                            id="login-password" 
                            type={showPassword.login ? "text" : "password"}
                            placeholder="Enter your password" 
                            value={loginForm.password}
                            onChange={(e) => setLoginForm((c) => ({ ...c, password: e.target.value }))}
                            autoComplete="current-password" 
                          />
                          <button 
                            type="button" 
                            className="pro-auth-icon-btn"
                            onClick={() => setShowPassword((c) => ({ ...c, login: !c.login }))}
                            aria-label={showPassword.login ? "Hide password" : "Show password"}
                          >
                            {showPassword.login ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </AnimatedInput>
                      </Field>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label className="pro-auth-remember">
                          <input 
                            type="checkbox" 
                            checked={loginForm.rememberMe}
                            onChange={(e) => setLoginForm((c) => ({ ...c, rememberMe: e.target.checked }))} 
                          />
                          Keep me signed in
                        </label>
                        <button type="button" className="pro-auth-forgot-link" onClick={() => switchMode("forgot")}>
                          Forgot password?
                        </button>
                      </div>
                      <motion.button 
                        type="submit" 
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "linear-gradient(135deg, #06b6d4, #0891b2)",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          fontFamily: "inherit",
                          border: "none",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(6,182,212,0.3)",
                          transition: "all 0.2s",
                        }}
                      >
                        {submittingText || <><span>Sign In</span><ArrowRight size={15} /></>}
                      </motion.button>
                      <div className="pro-auth-divider">
                        <div className="pro-auth-divider-line" />
                        <span className="pro-auth-divider-label">or continue with</span>
                        <div className="pro-auth-divider-line" />
                      </div>
                      <div className="pro-auth-social-row">
                        <motion.button 
                          type="button" 
                          className="pro-auth-social-btn"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <AppleSvg /> Apple
                        </motion.button>
                        <motion.button 
                          type="button" 
                          className="pro-auth-social-btn"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <GoogleSvg /> Google
                        </motion.button>
                      </div>
                    </motion.form>
                  )}

                  {/* ── REGISTER ── */}
                  {mode === "register" && (
                    <motion.form 
                      key="register" 
                      className="pro-auth-form" 
                      onSubmit={onRegister}
                      initial={{ opacity: 0, x: 15 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="pro-auth-row two-col">
                        <Field label="Display name" htmlFor="register-name">
                          <AnimatedInput id="register-name" icon={<UserRound size={15} />}>
                            <Input 
                              id="register-name" 
                              placeholder="Full name" 
                              value={registerForm.displayName}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, displayName: e.target.value }))} 
                            />
                          </AnimatedInput>
                        </Field>
                        <Field label="Campus ID" htmlFor="register-id">
                          <AnimatedInput id="register-id" icon={<BadgeCheck size={15} />}>
                            <Input 
                              id="register-id" 
                              placeholder="ADM/1234/26" 
                              value={registerForm.campusId}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, campusId: e.target.value }))} 
                            />
                          </AnimatedInput>
                        </Field>
                      </div>
                      <div className="pro-auth-row two-col">
                        <Field label="Email" htmlFor="register-email">
                          <AnimatedInput id="register-email" icon={<Mail size={15} />}>
                            <Input 
                              id="register-email" 
                              type="email" 
                              placeholder="name@example.com"
                              value={registerForm.campusEmail}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, campusEmail: e.target.value }))}
                              autoComplete="email" 
                            />
                          </AnimatedInput>
                        </Field>
                        <Field label="Phone" htmlFor="register-phone">
                          <AnimatedInput id="register-phone" icon={<Phone size={15} />}>
                            <Input 
                              id="register-phone" 
                              placeholder="+2547XXXXXXXX" 
                              value={registerForm.phone}
                              onChange={(e) => setRegisterForm((c) => ({ ...c, phone: e.target.value }))}
                              autoComplete="tel" 
                            />
                          </AnimatedInput>
                        </Field>
                      </div>
                      <Field label="Password" htmlFor="register-password">
                        <AnimatedInput id="register-password" icon={<Lock size={15} />}>
                          <Input 
                            id="register-password" 
                            type={showPassword.register ? "text" : "password"}
                            placeholder="Create a strong password" 
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm((c) => ({ ...c, password: e.target.value }))}
                            autoComplete="new-password" 
                          />
                          <button 
                            type="button" 
                            className="pro-auth-icon-btn"
                            onClick={() => setShowPassword((c) => ({ ...c, register: !c.register }))}
                            aria-label={showPassword.register ? "Hide password" : "Show password"}
                          >
                            {showPassword.register ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </AnimatedInput>
                      </Field>
                      <Field label="Confirm password" htmlFor="register-confirm">
                        <AnimatedInput id="register-confirm" icon={<ShieldCheck size={15} />}>
                          <Input 
                            id="register-confirm" 
                            type={showPassword.register ? "text" : "password"}
                            placeholder="Confirm your password" 
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm((c) => ({ ...c, confirmPassword: e.target.value }))}
                            autoComplete="new-password" 
                          />
                        </AnimatedInput>
                      </Field>
                      {registerForm.password && <EnhancedPasswordMeter value={registerForm.password} />}
                      <motion.button 
                        type="submit" 
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "linear-gradient(135deg, #06b6d4, #0891b2)",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          fontFamily: "inherit",
                          border: "none",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(6,182,212,0.3)",
                          transition: "all 0.2s",
                        }}
                      >
                        {submittingText || <><span>Create Account</span><ArrowRight size={15} /></>}
                      </motion.button>
                      <div className="pro-auth-divider">
                        <div className="pro-auth-divider-line" />
                        <span className="pro-auth-divider-label">or continue with</span>
                        <div className="pro-auth-divider-line" />
                      </div>
                      <div className="pro-auth-social-row">
                        <motion.button 
                          type="button" 
                          className="pro-auth-social-btn"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <AppleSvg /> Apple
                        </motion.button>
                        <motion.button 
                          type="button" 
                          className="pro-auth-social-btn"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <GoogleSvg /> Google
                        </motion.button>
                      </div>
                    </motion.form>
                  )}

                  {/* ── VERIFY ── */}
                  {mode === "verify" && (
                    <motion.form 
                      key="verify" 
                      className="pro-auth-form" 
                      onSubmit={onVerify}
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="pro-auth-info-box">
                        <Mail size={28} />
                        <p>Please check your email for the confirmation link.</p>
                        <p className="small">Click the link in the email to verify your account.</p>
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
                    <motion.form 
                      key="forgot" 
                      className="pro-auth-form" 
                      onSubmit={onForgot}
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Field label="Email" htmlFor="forgot-email">
                        <AnimatedInput id="forgot-email" icon={<Mail size={15} />}>
                          <Input 
                            id="forgot-email" 
                            type="email" 
                            placeholder="name@example.com"
                            value={forgotEmail} 
                            onChange={(e) => setForgotEmail(e.target.value)}
                            autoComplete="email" 
                          />
                        </AnimatedInput>
                      </Field>
                      <motion.button 
                        type="submit" 
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "linear-gradient(135deg, #06b6d4, #0891b2)",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          fontFamily: "inherit",
                          border: "none",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(6,182,212,0.3)",
                          transition: "all 0.2s",
                        }}
                      >
                        {submittingText || "Send Reset Link"}
                      </motion.button>
                      <Button variant="ghost" className="pro-auth-back-btn" onClick={() => switchMode("login")}>
                        ← Back to sign in
                      </Button>
                    </motion.form>
                  )}

                  {/* ── RESET ── */}
                  {mode === "reset" && (
                    <motion.form 
                      key="reset" 
                      className="pro-auth-form" 
                      onSubmit={onReset}
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Field label="New password" htmlFor="reset-password">
                        <AnimatedInput id="reset-password" icon={<Lock size={15} />}>
                          <Input 
                            id="reset-password" 
                            type={showPassword.reset ? "text" : "password"}
                            placeholder="Create a new password" 
                            value={resetForm.password}
                            onChange={(e) => setResetForm((c) => ({ ...c, password: e.target.value }))}
                            autoComplete="new-password" 
                          />
                          <button 
                            type="button" 
                            className="pro-auth-icon-btn"
                            onClick={() => setShowPassword((c) => ({ ...c, reset: !c.reset }))}
                            aria-label={showPassword.reset ? "Hide password" : "Show password"}
                          >
                            {showPassword.reset ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </AnimatedInput>
                      </Field>
                      <Field label="Confirm new password" htmlFor="reset-confirm">
                        <AnimatedInput id="reset-confirm" icon={<ShieldCheck size={15} />}>
                          <Input 
                            id="reset-confirm" 
                            type={showPassword.reset ? "text" : "password"}
                            placeholder="Repeat password" 
                            value={resetForm.confirmPassword}
                            onChange={(e) => setResetForm((c) => ({ ...c, confirmPassword: e.target.value }))}
                            autoComplete="new-password" 
                          />
                        </AnimatedInput>
                      </Field>
                      {resetForm.password && <EnhancedPasswordMeter value={resetForm.password} />}
                      <motion.button 
                        type="submit" 
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: 10,
                          background: isSubmitting ? "#e5e7eb" : "linear-gradient(135deg, #06b6d4, #0891b2)",
                          color: isSubmitting ? "#9ca3af" : "white",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          fontFamily: "inherit",
                          border: "none",
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 7,
                          boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(6,182,212,0.3)",
                          transition: "all 0.2s",
                        }}
                      >
                        {submittingText || "Reset Password"}
                      </motion.button>
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
          <RightPanel mode={mode} />

        </div>
      </main>
    </>
  );
}

