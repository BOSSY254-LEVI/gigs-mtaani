import { Link } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";

export function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-container">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <Link to="/" className="landing-brand">
              <div className="landing-brand-icon">
                <BriefcaseBusiness size={20} />
              </div>
              <span className="landing-brand-text">Gigs Mtaani</span>
            </Link>
            <p>Connecting talent with opportunity. Your trusted platform for flexible work across Kenya.</p>
          </div>
          <div className="landing-footer-links">
            <h4>Platform</h4>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/auth">Get Started</Link>
          </div>
          <div className="landing-footer-links">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Safety</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
          <div className="landing-footer-contact">
            <h4>Contact Us</h4>
            <div className="landing-footer-contact-item">
              <span>📧</span>
              <span>gigsmtaani@gmail.com</span>
            </div>
            <div className="landing-footer-contact-item">
              <span>📱</span>
              <span>+254 700 000 000</span>
            </div>
            <div className="landing-footer-contact-item">
              <span>📍</span>
              <span>Homabay, Kenya</span>
            </div>
          </div>
        </div>
        <div className="landing-footer-bottom">
          <p>&copy; 2026 Gigs Mtaani. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        /* Footer - Using specified color palette */
        .landing-footer {
          background: #164e63;
          border-top: 1px solid #f1f5f9;
          padding: 4rem 1.5rem 2rem;
        }

        .landing-footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .landing-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }

        @media (max-width: 900px) {
          .landing-footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .landing-footer-grid {
            grid-template-columns: 1fr;
          }
        }

        .landing-footer-brand p {
          margin-top: 1rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .landing-footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .landing-footer-links h4 {
          font-size: 1rem;
          color: #ffffff;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .landing-footer-links a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .landing-footer-links a:hover {
          color: #06b6d4;
        }

        .landing-footer-contact h4 {
          font-size: 1rem;
          color: #ffffff;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .landing-footer-contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .landing-footer-bottom {
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .landing-footer-bottom p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin: 0;
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
          background: #06b6d4;
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
          color: #ffffff;
        }
      `}</style>
    </footer>
  );
}

