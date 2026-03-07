import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { useAuthStore } from "../state/authStore";

type ApiLikeError = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
};

function errorMessage(error: unknown): string {
  const maybe = error as ApiLikeError;
  return maybe.response?.data?.error ?? maybe.response?.data?.message ?? maybe.message ?? "Authentication failed";
}

export function AuthPage() {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    campusEmail: "",
    phone: "",
    password: "",
    displayName: "",
    campusId: "",
    mfaCode: ""
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "REGISTER") {
        await authApi.register({
          campusEmail: form.campusEmail.trim(),
          phone: form.phone.trim(),
          password: form.password,
          displayName: form.displayName.trim(),
          campusId: form.campusId.trim()
        });
      }

      const login = await authApi.login({
        identifier: form.campusEmail.trim(),
        password: form.password,
        mfaCode: form.mfaCode.trim() || undefined
      });

      setSession({
        accessToken: login.accessToken,
        refreshToken: login.refreshToken,
        user: login.user
      });

      navigate("/app");
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin() {
    setLoading(true);
    setSession({
      accessToken: `demo-token-${Date.now()}`,
      refreshToken: `demo-refresh-${Date.now()}`,
      user: {
        id: "demo-user-1",
        campusEmail: "demo@campus.edu",
        phoneE164: "+254700000000",
        role: "STUDENT",
        status: "ACTIVE",
        displayName: "Demo User",
        campusId: "DEMO123",
        profile: {
          displayName: "Demo User",
          bio: "Demo account for testing",
          campusId: "DEMO123",
          skills: ["Photography", "Delivery", "Tutoring"],
          ratingAvg: 4.8,
          ratingCount: 25,
          avatarUrl: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    });
    navigate("/app");
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">GM</div>
          <h1>Gigs Mtaani</h1>
        </div>
        <p className="auth-subtitle">Secure hyperlocal gigs for comrades</p>

        <button className="demo-badge" onClick={handleDemoLogin} type="button">
          Welcome to Gigs Mtaani! 
        </button>

        <div className="auth-tabs">
          <button className={mode === "LOGIN" ? "active" : ""} onClick={() => setMode("LOGIN")} type="button">
            Login
          </button>
          <button className={mode === "REGISTER" ? "active" : ""} onClick={() => setMode("REGISTER")} type="button">
            Register
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          <input
            placeholder="Campus email"
            type="email"
            value={form.campusEmail}
            onChange={(e) => update("campusEmail", e.target.value)}
            required
          />

          {mode === "REGISTER" ? (
            <>
              <input
                placeholder="Phone (+254...)"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
              />
              <input
                placeholder="Display Name"
                type="text"
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                required
              />
              <input
                placeholder="Campus ID"
                type="text"
                value={form.campusId}
                onChange={(e) => update("campusId", e.target.value)}
                required
              />
            </>
          ) : null}

          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
          />
          <input
            placeholder="MFA code (if enabled)"
            type="text"
            value={form.mfaCode}
            onChange={(e) => update("mfaCode", e.target.value)}
          />

          {error ? <p className="error-text">{error}</p> : null}

          <button disabled={loading} type="submit">
            {loading ? "Please wait..." : mode === "LOGIN" ? "Login" : "Register & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
