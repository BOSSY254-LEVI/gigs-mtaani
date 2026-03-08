import { Link, useLocation } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="landing-header">
      <div className="landing-header-content">
        <Link to="/" className="landing-brand">
          <div className="landing-brand-icon">
            <BriefcaseBusiness size={24} />
          </div>
          <span className="landing-brand-text">Gigs Mtaani</span>
        </Link>
        <nav className="landing-nav">
          <Link 
            to="/" 
            className={`landing-nav-link ${isActive("/") ? "active" : ""}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`landing-nav-link ${isActive("/about") ? "active" : ""}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`landing-nav-link ${isActive("/contact") ? "active" : ""}`}
          >
            Contact
          </Link>
          <Link to="/auth" className="landing-nav-cta">Get Started</Link>
        </nav>
      </div>

      <style>{`
        /* Navigation Styles */
        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--light-border);
        }

        [data-theme="dark"] .landing-header {
          background: rgba(16, 32, 34, 0.95);
        }

        .landing-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.9rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .landing-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .landing-brand-icon {
          width: 42px;
          height: 42px;
          background: var(--primary);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }

        .landing-brand-text {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--dark-text);
        }

        .landing-nav {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .landing-nav-link {
          padding: 0.55rem 1rem;
          color: var(--muted-text);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .landing-nav-link:hover {
          background: var(--light-border);
          color: var(--dark-text);
        }

        .landing-nav-link.active {
          color: var(--primary);
          background: rgba(6, 182, 212, 0.1);
        }

        .landing-nav-cta {
          padding: 0.6rem 1.2rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: 8px;
          margin-left: 0.5rem;
          transition: all 0.2s;
        }

        .landing-nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6, 182, 212, 0.4);
        }

        @media (max-width: 768px) {
          .landing-nav {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

