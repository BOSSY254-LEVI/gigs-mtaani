import { useMemo, type ReactNode, useEffect } from "react";
import { useAuthStore } from "../state/authStore";
import { useThemeStore, initializeTheme } from "../state/themeStore";

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export function AppLayout({ children, title = "Gigs Mtaani" }: LayoutProps) {
  const { user, clearSession } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, []);

  const statusPill = useMemo(() => {
    const band = user?.trustScore?.band ?? "C";
    return `Trust ${band}`;
  }, [user?.trustScore?.band]);

  const displayName = user?.profile?.displayName || user?.displayName || "Comrade";
  const campusId = user?.profile?.campusId || user?.campusId || "Campus";

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <div className="nav-brand">
            <div className="nav-brand-icon">💼</div>
            <span className="nav-brand-text">Gigs Mtaani</span>
          </div>
          <div className="nav-actions">
            <div className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              <svg className="sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12H4M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <svg className="moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
              </svg>
            </div>
            <div className="nav-user">
              <div className="nav-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-white font-medium">{displayName}</span>
                <span className="text-muted text-sm">{campusId}</span>
              </div>
              <button 
                className="btn btn-secondary btn-sm" 
                onClick={clearSession}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}
