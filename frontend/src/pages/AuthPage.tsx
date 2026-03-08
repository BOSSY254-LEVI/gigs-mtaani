import { useEffect, useState, useMemo, FormEvent, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle, Sparkles, ShieldCheck, KeyRound, Mail, Lock, Phone, BadgeCheck, UserRound, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
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
import type { User } from "@supabase/supabase-js";

type AuthMode = "login" | "register" | "verify" | "forgot" | "reset";

interface AuthState {
  mode: AuthMode;
  verifyToken: string;
  resetToken: string;
}

// Initialize Supabase client
const supabase = createClient();

// Helper to format user
function formatGigsUser(user: User) {
  const metadata = user.user_metadata || {};
  return {
    id: user.id,
    email: user.email || "",
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

function PasswordChecklist({ value }: { value: string }) {
  const checks = useMemo(() => getPasswordChecks(value), [value]);
  const passed = checks.filter((item) => item.pass).length;

  return (
    <div className="pro-auth-password-box">
      <div className="pro-auth-password-head">
        <span>Password strength</span>
        <strong>{passed}/4</strong>
      </div>
      <div className="pro-auth-password-meter">
        {checks.map((item) => (
          <span
            key={item.label}
            className={item.pass ? "pro-auth-password-meter-bar is-pass" : "pro-auth-password-meter-bar"}
          />
        ))}
      </div>
      <ul className="pro-auth-password-checks">
        {checks.map((item) => (
          <li key={item.label} className={item.pass ? "is-pass" : ""}>
            <BadgeCheck size={14} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="pro-auth-field">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function TextInput({ id, icon, children }: { id: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="pro-auth-input-wrap" id={`${id}-wrap`}>
      {icon}
      {children}
    </div>
  );
}

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
  const [registerForm, setRegisterForm] = useState({
    displayName: "",
    campusEmail: "",
    phone: "",
    campusId: "",
    password: "",
    confirmPassword: ""
  });
  const [verifyToken, setVerifyToken] = useState(parsed.verifyToken);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({ token: parsed.resetToken, password: "", confirmPassword: "" });

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const gigsUser = formatGigsUser(session.user);
        setUser(gigsUser as any);
        setSession({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          user: gigsUser as any
        });
      } else if (event === "SIGNED_OUT") {
        // User signed out
      }
    });

    // Check if already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const gigsUser = formatGigsUser(session.user);
        setUser(gigsUser as any);
        setSession({
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          user: gigsUser as any
        });
        navigate("/app", { replace: true });
      }
    };
    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate, setSession, setUser]);

  function switchMode(nextMode: AuthMode, options?: { preserveFeedback?: boolean }) {
    setMode(nextMode);
    if (!options?.preserveFeedback) {
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginForm.identifier.trim().toLowerCase();
    const password = loginForm.password;

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    if (!emailPattern.test(email)) {
      setErrorMessage("Use a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed") || error.message.includes("Invalid login credentials")) {
          setErrorMessage("Please verify your email first. Check your inbox for the confirmation link.");
          setPendingEmail(email);
          return;
        }
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setErrorMessage("Please verify your email before logging in. Check your inbox for the confirmation link.");
        setPendingEmail(email);
        await supabase.auth.signOut();
        return;
      }

      const gigsUser = formatGigsUser(data.user);
      setSuccessMessage("Login successful!");
      setSession({
        accessToken: data.session?.access_token || "",
        refreshToken: data.session?.refresh_token || "",
        user: gigsUser as any
      });
      navigate("/app", { replace: true });
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = registerForm.campusEmail.trim().toLowerCase();
    const phone = registerForm.phone.trim();

    if (!registerForm.displayName.trim() || !registerForm.campusId.trim()) {
      setErrorMessage("Display name and campus ID are required.");
      return;
    }

    if (!emailPattern.test(email)) {
      setErrorMessage("Use a valid email address.");
      return;
    }

    if (!phonePattern.test(phone)) {
      setErrorMessage("Use phone format like +2547XXXXXXXX.");
      return;
    }

    if (getPasswordChecks(registerForm.password).some((check) => !check.pass)) {
      setErrorMessage("Password does not meet required strength.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: registerForm.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            display_name: registerForm.displayName.trim(),
            campus_id: registerForm.campusId.trim(),
            phone: phone,
          },
        },
      });

      if (error) {
        const errMsg = error.message || "";
        if (errMsg.includes("already been registered") || errMsg.includes("already exists")) {
          setErrorMessage("An account with this email already exists. Please sign in instead.");
          switchMode("login", { preserveFeedback: true });
          return;
        }
        throw error;
      }

      setPendingEmail(email);

      if (data.user && !data.session) {
        setSuccessMessage("Account created! Please check your email to verify your account before logging in.");
        setTimeout(() => {
          switchMode("login", { preserveFeedback: true });
          setLoginForm((current) => ({ ...current, identifier: email, password: "" }));
        }, 3000);
      } else if (data.session) {
        const gigsUser = formatGigsUser(data.user!);
        setSession({
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          user: gigsUser as any
        });
        navigate("/app", { replace: true });
      }
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error, "Registration failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
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
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/reset-password` : '';
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;
      
      setSuccessMessage("Password reset instructions have been sent to your email.");
      setTimeout(() => {
        switchMode("login", { preserveFeedback: true });
      }, 3000);
    } catch (error: any) {
      setSuccessMessage("If the account exists, password reset instructions have been sent to your email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (getPasswordChecks(resetForm.password).some((check) => !check.pass)) {
      setErrorMessage("Password does not meet required strength.");
      return;
    }

    if (resetForm.password !== resetForm.confirmPassword) {
      setErrorMessage("Password confirmation does not match.");
      return;
    }

    setErrorMessage("Please use the password reset link from your email to reset your password.");
  }

  const submittingText = isSubmitting ? <LoaderCircle className="spin" size={16} /> : null;

  return (
    <main className="pro-auth-page">
      <div className="pro-auth-background">
        <motion.span className="pro-auth-orb pro-auth-orb--one" animate={{ y: [0, -26, 0], x: [0, 16, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="pro-auth-orb pro-auth-orb--two" animate={{ y: [0, 20, 0], x: [0, -20, 0] }} transition={{ duration: 11.5, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <div className="pro-auth-shell">
        <motion.section className="pro-auth-aside" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <div className="pro-auth-brand">
            <div className="pro-auth-brand-mark"><Sparkles size={18} /></div>
            <div>
              <h1>Gigs Mtaani</h1>
              <p>Secure campus work, trusted payouts, live collaboration.</p>
            </div>
          </div>
          <div className="pro-auth-feature-list">
            <div className="pro-auth-feature-item"><ShieldCheck size={16} /><span>Production-grade auth with Supabase, email verification required.</span></div>
            <div className="pro-auth-feature-item"><KeyRound size={16} /><span>Secure sessions with end-to-end encryption and trust scoring.</span></div>
            <div className="pro-auth-feature-item"><ArrowRight size={16} /><span>Fast onboarding with instant account verification.</span></div>
          </div>
        </motion.section>

        <motion.section className="pro-auth-form-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.1 }}>
          <div className="pro-auth-theme-row">
            <span>Theme</span>
            <label>
              <Sparkles size={14} />
              <select value={theme} onChange={(event) => setTheme(event.target.value as ThemeName)} aria-label="Theme selector">
                {THEME_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
              </select>
            </label>
          </div>

          <Card className="pro-auth-card">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in or create an account to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pro-auth-tab-row">
                <Button variant={mode === "login" ? "default" : "ghost"} size="sm" onClick={() => switchMode("login")}>Sign in</Button>
                <Button variant={mode === "register" ? "default" : "ghost"} size="sm" onClick={() => switchMode("register")}>Create account</Button>
              </div>

              {successMessage ? (
                <p className="pro-auth-feedback is-success">
                  <CheckCircle size={16} />
                  {successMessage}
                </p>
              ) : null}
              {errorMessage ? (
                <p className="pro-auth-feedback is-error">
                  <AlertCircle size={16} />
                  {errorMessage}
                </p>
              ) : null}

              <AnimatePresence mode="wait" initial={false}>
                {mode === "login" && (
                  <motion.form key="login" className="pro-auth-form" onSubmit={onLogin} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <Field label="Email" htmlFor="login-identifier">
                      <TextInput id="login-identifier" icon={<Mail size={16} />}>
                        <Input id="login-identifier" type="email" placeholder="name@example.com" value={loginForm.identifier} onChange={(event) => setLoginForm((current) => ({ ...current, identifier: event.target.value }))} autoComplete="username" />
                      </TextInput>
                    </Field>
                    <Field label="Password" htmlFor="login-password">
                      <TextInput id="login-password" icon={<Lock size={16} />}>
                        <Input id="login-password" type={showPassword.login ? "text" : "password"} placeholder="Enter your password" value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} autoComplete="current-password" />
                        <button type="button" className="pro-auth-icon-btn" onClick={() => setShowPassword((current) => ({ ...current, login: !current.login }))} aria-label={showPassword.login ? "Hide password" : "Show password"}>{showPassword.login ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      </TextInput>
                    </Field>
                    <label className="pro-auth-remember"><input type="checkbox" checked={loginForm.rememberMe} onChange={(event) => setLoginForm((current) => ({ ...current, rememberMe: event.target.checked }))} />Keep me signed in on this device</label>
                    <Button type="submit" disabled={isSubmitting}>{submittingText || "Sign in"}</Button>
                    <Button variant="ghost" onClick={() => switchMode("forgot")}>Forgot password?</Button>
                  </motion.form>
                )}

                {mode === "register" && (
                  <motion.form key="register" className="pro-auth-form" onSubmit={onRegister} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <div className="pro-auth-row two-col">
                      <Field label="Display name" htmlFor="register-name"><TextInput id="register-name" icon={<UserRound size={16} />}><Input id="register-name" placeholder="Your full name" value={registerForm.displayName} onChange={(event) => setRegisterForm((current) => ({ ...current, displayName: event.target.value }))} /></TextInput></Field>
                      <Field label="Campus ID" htmlFor="register-id"><TextInput id="register-id" icon={<BadgeCheck size={16} />}><Input id="register-id" placeholder="ADM/1234/26" value={registerForm.campusId} onChange={(event) => setRegisterForm((current) => ({ ...current, campusId: event.target.value }))} /></TextInput></Field>
                    </div>
                    <div className="pro-auth-row two-col">
                      <Field label="Email" htmlFor="register-email"><TextInput id="register-email" icon={<Mail size={16} />}><Input id="register-email" type="email" placeholder="name@example.com" value={registerForm.campusEmail} onChange={(event) => setRegisterForm((current) => ({ ...current, campusEmail: event.target.value }))} autoComplete="email" /></TextInput></Field>
                      <Field label="Phone number" htmlFor="register-phone"><TextInput id="register-phone" icon={<Phone size={16} />}><Input id="register-phone" placeholder="+2547XXXXXXXX" value={registerForm.phone} onChange={(event) => setRegisterForm((current) => ({ ...current, phone: event.target.value }))} autoComplete="tel" /></TextInput></Field>
                    </div>
                    <Field label="Password" htmlFor="register-password">
                      <TextInput id="register-password" icon={<Lock size={16} />}>
                        <Input id="register-password" type={showPassword.register ? "text" : "password"} placeholder="Create a strong password" value={registerForm.password} onChange={(event) => setRegisterForm((current) => ({ ...current, password: event.target.value }))} autoComplete="new-password" />
                        <button type="button" className="pro-auth-icon-btn" onClick={() => setShowPassword((current) => ({ ...current, register: !current.register }))} aria-label={showPassword.register ? "Hide password" : "Show password"}>{showPassword.register ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      </TextInput>
                    </Field>
                    <Field label="Confirm password" htmlFor="register-confirm"><TextInput id="register-confirm" icon={<ShieldCheck size={16} />}><Input id="register-confirm" type={showPassword.register ? "text" : "password"} placeholder="Confirm your password" value={registerForm.confirmPassword} onChange={(event) => setRegisterForm((current) => ({ ...current, confirmPassword: event.target.value }))} autoComplete="new-password" /></TextInput></Field>
                    <PasswordChecklist value={registerForm.password} />
                    <Button type="submit" disabled={isSubmitting}>{submittingText || "Create account"}</Button>
                  </motion.form>
                )}

                {mode === "verify" && (
                  <motion.form key="verify" className="pro-auth-form" onSubmit={onVerify} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <div className="pro-auth-info-box">
                      <Mail size={24} />
                      <p>Please check your email for the confirmation link.</p>
                      <p className="small">Click the link in the email to verify your account. The link will redirect you back to the app.</p>
                    </div>
                    {pendingEmail ? (
                      <div className="pro-auth-pending-email">
                        <span>Confirmation sent to:</span>
                        <strong>{pendingEmail}</strong>
                      </div>
                    ) : null}
                    <Button variant="ghost" onClick={() => switchMode("login")}>Back to sign in</Button>
                  </motion.form>
                )}

                {mode === "forgot" && (
                  <motion.form key="forgot" className="pro-auth-form" onSubmit={onForgot} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    <div className="pro-auth-info-box">
                      <Mail size={24} />
                      <p>Enter your email to receive password reset instructions.</p>
                    </div>
                    <Field label="Email" htmlFor="forgot-email"><TextInput id="forgot-email" icon={<Mail size={16} />}><Input id="forgot-email" type="email" placeholder="name@example.com" value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} autoComplete="email" /></TextInput></Field>
                    <Button type="submit" disabled={isSubmitting}>{submittingText || "Request reset link"}</Button>
                    <Button variant="ghost" onClick={() => switchMode("login")}>Back to sign in</Button>
                  </motion.form>
                )}

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
  );
}

