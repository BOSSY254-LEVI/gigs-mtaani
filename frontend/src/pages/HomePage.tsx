import { Link } from "react-router-dom";
import { 
  BriefcaseBusiness, 
  Search, 
  Shield, 
  Clock, 
  CreditCard, 
  Star,
  ArrowRight,
  CheckCircle2,
  Zap,
  Quote,
  MapPin
} from "lucide-react";
import { Footer } from "./Footer";
import { Navigation } from "../components/Navigation";
import { CategoriesSection } from "../components/CategoriesSection";

export function HomePage() {

  const features = [
    {
      icon: Search,
      title: "Find Gigs Easily",
      description: "Browse hundreds of available gigs in your area. Filter by location, pay, and category to find your perfect match."
    },
    {
      icon: Shield,
      title: "Verified & Secure",
      description: "Every worker is vetted. Secure payments with escrow protection ensure you're paid for every job completed."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work on your own time. Choose gigs that fit your schedule and earn money on your terms."
    },
    {
      icon: CreditCard,
      title: "Fast Payments",
      description: "Get paid within 24-48 hours after completing a job. Multiple payment methods available."
    },
    {
      icon: Star,
      title: "Build Your Rep",
      description: "Earn reviews and ratings to build your reputation. Stand out to clients and command higher rates."
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description: "Our smart algorithm matches you with the right gigs instantly. No more endless searching."
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and build your profile. Add your skills, experience, and preferences to get started."
    },
    {
      step: "02",
      title: "Browse & Apply",
      description: "Explore available gigs that match your skills. Apply directly and wait for client approval."
    },
    {
      step: "03",
      title: "Complete the Work",
      description: "Once matched, complete the gig professionally. Communicate clearly and deliver quality work."
    },
    {
      step: "04",
      title: "Get Paid",
      description: "After approval, receive payment directly to your account. Build your reputation with every job."
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Gigs" },
    { value: "5K+", label: "Verified Workers" },
    { value: "50+", label: "Campuses" },
    { value: "98%", label: "Satisfaction Rate" }
  ];

  const testimonials = [
    {
      quote: "Gigs Mtaani changed my life! I can now work around my classes and earn money for my tuition.",
      author: "Sarah W.",
      role: "University Student",
      avatar: "S"
    },
    {
      quote: "As a business owner, I found reliable help within hours. The quality of workers is impressive.",
      author: "James M.",
      role: "Business Owner",
      avatar: "J"
    },
    {
      quote: "The payment process is seamless. I've never had any issues getting paid on time.",
      author: "Emily K.",
      role: "Freelancer",
      avatar: "E"
    }
  ];

  const categories = [
    "Delivery", "Tutoring", "Cleaning", "Moving", "Event Staff", 
    "Photography", "Graphic Design", "Web Dev", "Writing", "More"
  ];

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <Navigation />

      {/* ===================== HERO SECTION ===================== */}
      <section className="hero-section">
        <div className="hero-container">

          {/* LEFT: Text Content */}
          <div className="hero-content">
            {/* Badge */}
            <span className="hero-badge">
              <span className="hero-badge-dot"></span>
              Kenya's #1 Gig Platform
            </span>

            {/* Title */}
            <h1 className="hero-title">
              Find Flexible Work <br />
              <span className="hero-title-highlight">On Your Terms</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Connect with thousands of gigs and opportunities. Join Kenya's #1
              platform for students and freelancers. Earn extra cash while you
              study or build your portfolio.
            </p>

            {/* CTA Buttons */}
            <div className="hero-actions">
              <Link to="/auth" className="hero-btn-primary">
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="hero-btn-secondary">
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats-row">
              {[
                { value: "10K+", label: "ACTIVE GIGS" },
                { value: "5K+",  label: "WORKERS" },
                { value: "98%",  label: "SATISFACTION" },
              ].map((s) => (
                <div className="hero-stat-box" key={s.label}>
                  <span className="hero-stat-val">{s.value}</span>
                  <span className="hero-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Success Card */}
          <div className="hero-visual">
            <div className="success-card">

              {/* Card Top Row */}
              <div className="sc-top-row">
                <div className="sc-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                  <span className="sc-rating-num">5.0</span>
                </div>
                <span className="sc-payment-badge">
                  <CheckCircle2 size={13} />
                  Payment Received
                </span>
              </div>

              {/* Worker Row */}
              <div className="sc-worker-row">
                <div className="sc-avatars">
                  <div className="sc-avatar">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfRW1fz4B26L5bm3z2OjxHCeApsvVMHGMs3AOPrDDtJxy_-uqw5KxzIdjO98PlAlhjmAiHNOmV-GrQNsxfYWOA1O74dXoeflvjOBCO99vLwdsED-wys78YNfkILc86da_EjRBPByMtFFV1sIZV2SPYeNCG9rgCfhM2FYyYYFPQJQR5XEnTEySWds8sswVhZdV7hUQbwSTDC3OHjhlpp2Q2E_4jwTvG7RUWt-bmju8_AHRfMwRyHcJmV4nWo606bw404_IKy77a9c8"
                      alt="avatar"
                    />
                  </div>
                  <div
                    className="sc-avatar sc-avatar-2"
                    style={{
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDInlhgFA3yheXPe6LYtk5DPHs2NP5D2diR5OdxTuYrUenDJhbJBRQHlqqWbEMRKAQFJGN4eNs2YebMg3Ta2dm0SO-kF2Oov7rUXPLxdQh-2VW8hp4aykn16Cn5qJ8Rx3Ot4ko1WjCYjtzO3twD9yI5NMf_bqQ_YvvtFQxLeo57KYTPzhsMcqNu89wj-F6OKTsnLHDe6MK19r0jlFCnOlnQqdUzZSp-VNAvMRRULho3p7p9_B61_5nk4Ef0E3cWoVUpyLtE7Bs13EY')",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                </div>
                <div>
                  <div className="sc-worker-name">Slim Shady</div>
                  <div className="sc-worker-sub">
                    Verified Worker <span className="sc-online-dot">●</span> 4.9
                  </div>
                </div>
              </div>

              {/* Gig Info Box */}
              <div className="sc-gig-box">
                <div>
                  <div className="sc-gig-label">COMPLETED GIG</div>
                  <div className="sc-gig-title">Office Cleaning</div>
                  <div className="sc-gig-location">
                    <MapPin size={13} />
                    Westlands, Nairobi
                  </div>
                </div>
                <div className="sc-gig-price">
                  <div className="sc-price-val">KSh 2,500</div>
                  <div className="sc-paid-label">PAID INSTANTLY</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="sc-progress">
                <div className="sc-bar sc-bar-active"></div>
                <div className="sc-bar sc-bar-inactive"></div>
                <div className="sc-bar sc-bar-inactive"></div>
              </div>

            </div>
          </div>

        </div>
      </section>
      {/* ===================== END HERO ===================== */}

      {/* Categories Section */}
      <CategoriesSection />

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <span className="section-kicker">Why Choose Us</span>
            <h2 className="section-title">
              Everything You Need to <span className="text-gradient">Succeed</span>
            </h2>
            <p className="section-subtitle">
              We provide all the tools and support you need to find work and get paid securely
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="how-container">
          <div className="section-header">
            <span className="section-kicker">Simple Process</span>
            <h2 className="section-title">
              How <span className="text-gradient">It Works</span>
            </h2>
            <p className="section-subtitle">
              Get started in minutes and start earning
            </p>
          </div>
          <div className="how-steps">
            {howItWorks.map((step, index) => (
              <div key={index} className="how-step">
                <div className="how-step-number">{step.step}</div>
                <div className="how-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="how-step-arrow">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-bg"></div>
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <span className="section-kicker">Testimonials</span>
            <h2 className="section-title">
              What Our Users <span className="text-gradient">Say</span>
            </h2>
            <p className="section-subtitle">
              Join thousands of satisfied workers and clients
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-quote">
                  <Quote size={32} />
                </div>
                <p className="testimonial-text">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div>
                    <h4>{testimonial.author}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Start Earning?</h2>
            <p>Join thousands of workers already earning with Gigs Mtaani. It takes less than 2 minutes to sign up.</p>
            <div className="cta-actions">
              <Link to="/auth" className="btn btn-primary btn-lg">
                Create Free Account
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Have Questions?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style>{`
        /* ============ KEYFRAME ANIMATIONS ============ */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.15); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.25); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* ============ COLOR VARIABLES ============ */
        :root {
          --primary: #06b6d4;
          --accent: #f59e0b;
          --bg-light: #f5f8f8;
          --bg-dark: #102022;
          --dark-text: #164e63;
          --white-cards: #ffffff;
          --muted-text: #64748b;
          --light-border: #f1f5f9;
          --success: #10b981;
        }

        .landing-page {
          min-height: 100vh;
          background: var(--bg-light);
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        /* ============ HERO SECTION ============ */
        .hero-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #f5f8f8 60%, #e8f5f8 100%);
          padding: 80px 40px 60px;
          min-height: 520px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .hero-section::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 1024px) {
          .hero-container { grid-template-columns: 1fr; gap: 40px; }
          .hero-visual { display: none; }
          .hero-section { padding: 60px 20px 40px; }
        }

        /* Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(6,182,212,0.1);
          color: var(--primary);
          padding: 5px 14px;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
          width: fit-content;
          animation: slideUp 0.6s ease-out;
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .hero-badge-dot {
          width: 7px;
          height: 7px;
          background: var(--primary);
          border-radius: 9999px;
          position: relative;
          flex-shrink: 0;
        }

        .hero-badge-dot::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: var(--primary);
          animation: heroPing 1.4s cubic-bezier(0,0,0.2,1) infinite;
        }

        @keyframes heroPing {
          0%   { transform: scale(1); opacity: 0.75; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        /* Title */
        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: var(--dark-text);
          margin-bottom: 18px;
          animation: slideUp 0.7s ease-out 0.1s both;
        }

        .hero-title-highlight {
          color: var(--primary);
          text-decoration: underline;
          text-decoration-color: rgba(6,182,212,0.3);
          text-underline-offset: 5px;
          transition: all 0.3s ease;
        }

        .hero-title:hover .hero-title-highlight {
          text-decoration-color: var(--primary);
          text-decoration-thickness: 3px;
        }

        /* Subtitle */
        .hero-subtitle {
          font-size: 1rem;
          color: var(--muted-text);
          line-height: 1.75;
          max-width: 440px;
          margin-bottom: 28px;
          animation: slideUp 0.7s ease-out 0.2s both;
        }

        /* Buttons */
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 36px;
          flex-wrap: wrap;
          animation: slideUp 0.7s ease-out 0.3s both;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--primary);
          color: white;
          padding: 14px 26px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(6,182,212,0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .hero-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }

        .hero-btn-primary:hover::before {
          left: 100%;
        }

        .hero-btn-primary:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 35px rgba(6,182,212,0.4);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          background: white;
          color: var(--dark-text);
          padding: 14px 26px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          border: 1.5px solid #e2e8f0;
          transition: all 0.3s ease;
          position: relative;
        }

        .hero-btn-secondary:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(6,182,212,0.2);
        }

        /* Stats Row */
        .hero-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          animation: slideUp 0.7s ease-out 0.4s both;
        }

        .hero-stat-box {
          background: white;
          border-radius: 12px;
          padding: 16px 18px;
          border: 1px solid rgba(6,182,212,0.08);
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.3s ease;
          cursor: default;
        }

        .hero-stat-box:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(6,182,212,0.15);
          border-color: var(--primary);
        }

        .hero-stat-val {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--primary);
          line-height: 1;
        }

        .hero-stat-lbl {
          font-size: 0.62rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ============ SUCCESS CARD ============ */
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          animation: slideUp 0.7s ease-out 0.2s both;
        }

        .success-card {
          background: white;
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
          width: 100%;
          max-width: 380px;
          animation: float 4s ease-in-out infinite;
          transition: all 0.3s ease;
          position: relative;
        }

        .success-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(6,182,212,0.05), rgba(245,158,11,0.02));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .success-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 80px rgba(6,182,212,0.2), 0 8px 24px rgba(0,0,0,0.08);
        }

        .success-card:hover::before {
          opacity: 1;
        }

        /* Top Row */
        .sc-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sc-stars {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .sc-rating-num {
          font-weight: 800;
          color: var(--dark-text);
          font-size: 1rem;
          margin-left: 6px;
        }

        .sc-payment-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #d1fae5;
          color: #065f46;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
        }

        /* Worker Row */
        .sc-worker-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .sc-avatars {
          display: flex;
        }

        .sc-avatar {
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          border: 2.5px solid white;
          overflow: hidden;
          margin-right: -10px;
          flex-shrink: 0;
          background: #e2e8f0;
        }

        .sc-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sc-avatar-2 {
          overflow: hidden;
          margin-right: 0;
        }

        .sc-worker-name {
          font-weight: 700;
          color: #0f172a;
          font-size: 0.95rem;
        }

        .sc-worker-sub {
          font-size: 0.78rem;
          color: var(--muted-text);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sc-online-dot { color: var(--success); font-size: 10px; }

        /* Gig Box */
        .sc-gig-box {
          background: var(--bg-light);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .sc-gig-label {
          font-size: 0.62rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .sc-gig-title {
          font-weight: 700;
          color: var(--dark-text);
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .sc-gig-location {
          font-size: 0.78rem;
          color: var(--muted-text);
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .sc-gig-price { text-align: right; }

        .sc-price-val {
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--primary);
        }

        .sc-paid-label {
          font-size: 0.58rem;
          font-weight: 700;
          color: #059669;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Progress */
        .sc-progress {
          display: flex;
          gap: 6px;
        }

        .sc-bar {
          flex: 1;
          height: 4px;
          border-radius: 9999px;
        }

        .sc-bar-active  { background: var(--primary); }
        .sc-bar-inactive { background: #e2e8f0; }

        /* ============ CATEGORIES STRIP ============ */
        .categories-strip {
          background: var(--white-cards);
          border-top: 1px solid var(--light-border);
          border-bottom: 1px solid var(--light-border);
          padding: 1rem 1.5rem;
          overflow-x: auto;
          animation: slideUp 0.6s ease-out;
        }

        .categories-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .categories-container p {
          color: var(--muted-text);
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .categories-list {
          display: flex;
          gap: 0.75rem;
          flex-wrap: nowrap;
        }

        .category-tag {
          padding: 0.4rem 0.9rem;
          background: var(--light-border);
          color: var(--muted-text);
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: 9999px;
          white-space: nowrap;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .category-tag::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.4s;
        }

        .category-tag:hover::before {
          left: 100%;
        }

        .category-tag:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6,182,212,0.3);
        }

        /* ============ SECTIONS COMMON ============ */
        .section-header {
          text-align: center;
          margin-bottom: 3.5rem;
          animation: slideUp 0.6s ease-out;
        }

        .section-kicker {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: rgba(6, 182, 212, 0.1);
          color: var(--primary);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-radius: 9999px;
          margin-bottom: 1rem;
          border: 1px solid rgba(6, 182, 212, 0.2);
          animation: slideUp 0.6s ease-out 0.1s both;
          transition: all 0.3s ease;
        }

        .section-kicker:hover {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--primary);
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: var(--dark-text);
          animation: slideUp 0.6s ease-out 0.15s both;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--muted-text);
          max-width: 550px;
          margin: 0 auto;
          animation: slideUp 0.6s ease-out 0.2s both;
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: all 0.3s ease;
        }

        /* ============ FEATURES ============ */
        .features-section {
          padding: 80px 1.5rem;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .features-grid { grid-template-columns: 1fr; } }

        .feature-card {
          background: var(--white-cards);
          border: 1px solid var(--light-border);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: slideUp 0.6s ease-out forwards;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--primary), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .feature-card:nth-child(1) { animation-delay: 0.1s; }
        .feature-card:nth-child(2) { animation-delay: 0.2s; }
        .feature-card:nth-child(3) { animation-delay: 0.3s; }
        .feature-card:nth-child(4) { animation-delay: 0.4s; }
        .feature-card:nth-child(5) { animation-delay: 0.5s; }
        .feature-card:nth-child(6) { animation-delay: 0.6s; }

        .feature-card:hover::before {
          transform: scaleX(1);
          transform-origin: right;
        }

        .feature-card:hover {
          border-color: var(--primary);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(6, 182, 212, 0.2);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--primary), #0891b2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1.25rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-icon::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.15) rotate(5deg);
          box-shadow: 0 8px 20px rgba(6,182,212,0.4);
        }

        .feature-card:hover .feature-icon::before {
          opacity: 1;
        }

        .feature-title {
          font-size: 1.2rem;
          color: var(--dark-text);
          margin-bottom: 0.75rem;
        }

        .feature-desc {
          font-size: 0.95rem;
          color: var(--muted-text);
          line-height: 1.6;
          margin: 0;
        }

        /* ============ HOW IT WORKS ============ */
        .how-section {
          padding: 80px 1.5rem;
          background: var(--white-cards);
        }

        .how-container { max-width: 1100px; margin: 0 auto; }

        .how-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 900px) { .how-steps { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .how-steps { grid-template-columns: 1fr; } }

        .how-step {
          position: relative;
          padding: 1.5rem;
          background: var(--bg-light);
          border: 1px solid var(--light-border);
          border-radius: 16px;
          transition: all 0.3s ease;
          animation: slideUp 0.6s ease-out forwards;
        }

        .how-step:nth-child(1) { animation-delay: 0.1s; }
        .how-step:nth-child(2) { animation-delay: 0.2s; }
        .how-step:nth-child(3) { animation-delay: 0.3s; }
        .how-step:nth-child(4) { animation-delay: 0.4s; }

        .how-step::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(6,182,212,0.05), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .how-step:hover {
          border-color: var(--primary);
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(6,182,212,0.15);
        }

        .how-step:hover::before {
          opacity: 1;
        }

        .how-step-number {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          margin-bottom: 1rem;
        }

        .how-step-content h3 { font-size: 1.1rem; color: var(--dark-text); margin-bottom: 0.5rem; }
        .how-step-content p  { font-size: 0.9rem; color: var(--muted-text); line-height: 1.6; margin: 0; }

        .how-step-arrow {
          position: absolute;
          top: 50%;
          right: -1.25rem;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          background: var(--light-border);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted-text);
          z-index: 1;
        }

        @media (max-width: 900px) { .how-step-arrow { display: none; } }

        /* ============ STATS ============ */
        .stats-section {
          position: relative;
          padding: 60px 1.5rem;
          background: linear-gradient(135deg, var(--primary), #0d9488);
          overflow: hidden;
        }

        .stats-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
          animation: float 8s ease-in-out infinite;
        }

        .stats-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 50%);
        }

        .stats-container {
          position: relative;
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }

        @media (max-width: 640px) { .stats-container { grid-template-columns: repeat(2, 1fr); } }

        .stat-item  {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          animation: slideUp 0.6s ease-out forwards;
        }

        .stat-item:nth-child(1) { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        .stat-item:nth-child(4) { animation-delay: 0.4s; }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          transition: all 0.3s ease;
          cursor: default;
        }

        .stat-label {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.8);
          transition: color 0.3s ease;
        }

        .stat-item:hover .stat-value {
          transform: scale(1.15);
          filter: drop-shadow(0 0 10px rgba(255,255,255,0.3));
        }

        .stat-item:hover .stat-label {
          color: white;
        }

        /* ============ TESTIMONIALS ============ */
        .testimonials-section { padding: 80px 1.5rem; }
        .testimonials-container { max-width: 1200px; margin: 0 auto; }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: 1fr; max-width: 500px; margin: 0 auto; }
        }

        .testimonial-card {
          background: var(--white-cards);
          border: 1px solid var(--light-border);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          animation: slideUp 0.6s ease-out forwards;
          transition: all 0.3s ease;
        }

        .testimonial-card:nth-child(1) { animation-delay: 0.1s; }
        .testimonial-card:nth-child(2) { animation-delay: 0.2s; }
        .testimonial-card:nth-child(3) { animation-delay: 0.3s; }

        .testimonial-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(6,182,212,0.03), rgba(245,158,11,0.02));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          border-color: var(--primary);
          box-shadow: 0 16px 40px rgba(6,182,212,0.15);
        }

        .testimonial-card:hover::before {
          opacity: 1;
        }

        .testimonial-quote {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          color: var(--primary);
          opacity: 0.2;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover .testimonial-quote {
          opacity: 0.4;
          transform: scale(1.2);
        }
        .testimonial-text  { font-size: 1rem; color: var(--muted-text); line-height: 1.7; margin-bottom: 1.5rem; font-style: italic; }

        .testimonial-author { display: flex; align-items: center; gap: 0.85rem; }

        .testimonial-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary), #0891b2);
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(6,182,212,0.3);
          transition: all 0.3s ease;
        }

        .testimonial-author:hover .testimonial-avatar {
          transform: scale(1.1);
          box-shadow: 0 8px 20px rgba(6,182,212,0.4);
        }

        .testimonial-author h4   { font-size: 1rem; color: var(--dark-text); margin-bottom: 0.15rem; }
        .testimonial-author span { font-size: 0.85rem; color: var(--muted-text); }

        /* ============ CTA ============ */
        .cta-section {
          padding: 80px 1.5rem;
          background: linear-gradient(135deg, rgba(6,182,212,0.03), rgba(245,158,11,0.02));
          border-top: 1px solid rgba(6,182,212,0.1);
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .cta-section::after {
          content: '';
          position: absolute;
          bottom: -40%;
          left: -15%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite reverse;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 2;
          animation: slideUp 0.6s ease-out;
        }

        .cta-content h2 {
          font-size: 2.25rem;
          color: var(--dark-text);
          margin-bottom: 1rem;
          animation: slideUp 0.6s ease-out 0.1s both;
        }

        .cta-content p {
          font-size: 1.15rem;
          color: var(--muted-text);
          margin-bottom: 2rem;
          max-width: 550px;
          margin-left: auto;
          margin-right: auto;
          animation: slideUp 0.6s ease-out 0.2s both;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          animation: slideUp 0.6s ease-out 0.3s both;
        }

        @media (max-width: 500px) { .cta-actions { flex-direction: column; align-items: center; } }

        .cta-actions .btn { display: inline-flex; align-items: center; gap: 0.5rem; }

        /* ============ SHARED BUTTONS ============ */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: none;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }

        .btn:hover::before {
          transform: translateX(100%);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), #0891b2);
          color: white;
          box-shadow: 0 4px 15px rgba(6,182,212,0.3);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(6,182,212,0.4);
        }

        .btn-secondary {
          background: var(--light-border);
          color: var(--dark-text);
          border: 1px solid var(--light-border);
        }

        .btn-secondary:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(6,182,212,0.3);
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        /* ============ RESPONSIVE ============ */
        @media (max-width: 768px) {
          .features-section,
          .how-section,
          .testimonials-section,
          .cta-section { padding: 60px 1.5rem; }
        }
      `}</style>
    </div>
  );
}