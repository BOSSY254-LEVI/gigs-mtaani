import { useMemo, type ReactNode } from "react";
import { BriefcaseBusiness, LogOut, Palette } from "lucide-react";
import { useAuthStore } from "../state/authStore";
import { THEME_OPTIONS, type ThemeName, useThemeStore } from "../state/themeStore";

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export function AppLayout({ children, title = "Gigs Mtaani" }: LayoutProps) {
  const { user, clearSession } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const displayName = useMemo(() => {
    return user?.profile?.displayName || user?.displayName || "Comrade";
  }, [user?.displayName, user?.profile?.displayName]);

  const campusId = user?.profile?.campusId || user?.campusId || "Campus";

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <BriefcaseBusiness size={18} />
            </div>
            <div className="nav-brand-copy">
              <span className="nav-brand-text">Gigs Mtaani</span>
              <small className="text-muted">{title}</small>
            </div>
          </div>

          <div className="nav-actions">
            <label className="layout-theme-control">
              <Palette size={14} />
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value as ThemeName)}
                aria-label="Select dashboard theme"
              >
                {THEME_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="nav-user">
              <div className="nav-avatar">{displayName.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">{campusId}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={clearSession}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="dashboard-content">{children}</main>
    </div>
  );
}
