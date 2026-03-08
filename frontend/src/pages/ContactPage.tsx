import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Footer } from "./Footer";

export function ContactPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@gigsmtaani.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+254 700 000 000",
      description: "Mon - Fri, 9am - 6pm EAT"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Nairobi, Kenya",
      description: "Come say hello at our office"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: "24/7 Online Support",
      description: "We're always here to help"
    }
  ];

  const faqs = [
    {
      question: "How do I get started with Gigs Mtaani?",
      answer: "Simply sign up for a free account, verify your email, and complete your profile. You can then start browsing gigs or posting tasks immediately. Our verification process typically takes 24-48 hours."
    },
    {
      question: "Is it free to use Gigs Mtaani?",
      answer: "Yes! Creating an account and browsing gigs is completely free. We charge a small service fee only when you successfully complete a transaction. This helps us maintain the platform and provide excellent support."
    },
    {
      question: "How do payments work?",
      answer: "Payments are processed securely through our platform. Workers receive their earnings within 24-48 hours after task completion and approval. We support M-Pesa, bank transfers, and other popular payment methods."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We take satisfaction seriously. If you're not happy with a completed task, you can request a review within 48 hours. Our support team will mediate and ensure a fair resolution."
    },
    {
      question: "How do you ensure safety and trust?",
      answer: "We implement multiple safety measures including: worker verification, secure payment escrow, review ratings, and 24/7 support. Both parties are protected throughout the transaction."
    },
    {
      question: "Can I use Gigs Mtaani for my business?",
      answer: "Absolutely! We offer business accounts with additional features like team management, bulk posting, and priority support. Contact us at business@gigsmtaani.com for custom solutions."
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation Header */}
      <Navigation />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <div className="contact-hero-orb contact-hero-orb-1"></div>
          <div className="contact-hero-orb contact-hero-orb-2"></div>
        </div>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="contact-hero-subtitle">
            Have questions? We'd love to hear from you. Our team is here to help 
            and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="contact-info-container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="contact-info-icon">
                  <info.icon size={24} />
                </div>
                <div className="contact-info-content">
                  <h3>{info.title}</h3>
                  <p className="contact-info-main">{info.content}</p>
                  <p className="contact-info-desc">{info.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-grid">
            {/* Contact Form */}
            <div className="contact-form-card">
              <div className="contact-form-header">
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you soon</p>
              </div>
              
              {formSubmitted ? (
                <div className="contact-form-success">
                  <CheckCircle2 size={48} />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll respond within 24 hours.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="contact-form-row">
                    <div className="contact-form-field">
                      <label htmlFor="name">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="contact-form-field">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="business">Business Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="contact-form-field">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      required
                    />
                  </div>
                  <button type="submit" className="contact-form-submit">
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="contact-sidebar">
              {/* Quick Contact */}
              <div className="contact-quick-card">
                <h3>Quick Contact</h3>
                <p>Prefer a quick chat? Reach out directly</p>
                <div className="contact-quick-actions">
                  <a href="mailto:hello@gigsmtaani.com" className="contact-quick-btn">
                    <Mail size={18} />
                    Email Support
                  </a>
                  <a href="tel:+254700000000" className="contact-quick-btn">
                    <Phone size={18} />
                    Call Now
                  </a>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-social-card">
                <h3>Follow Us</h3>
                <p>Stay updated with our latest news</p>
                <div className="contact-social-links">
                  <a href="#" className="contact-social-link" aria-label="Facebook">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="contact-social-link" aria-label="Twitter">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="contact-social-link" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="contact-social-link" aria-label="LinkedIn">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="contact-response-card">
                <MessageCircle size={24} />
                <div>
                  <h4>Average Response Time</h4>
                  <p>Under 2 hours during business hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-header">
            <span className="about-kicker">FAQ</span>
            <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
            <p>Find answers to common questions about Gigs Mtaani</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaq === index ? 'faq-item-open' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  {openFaq === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="faq-cta">
            <p>Still have questions?</p>
            <Link to="/auth" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: var(--bg-primary);
        }

        /* Header */
        .landing-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--bg-tertiary);
        }

        [data-theme="dark"] .landing-header {
          background: rgba(15, 23, 42, 0.85);
        }

        .landing-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
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
          background: var(--gradient-primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 15px rgba(20, 184, 166, 0.3);
        }

        .landing-brand-text {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .landing-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .landing-nav-link {
          padding: 0.6rem 1rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
          transition: all var(--transition-base);
        }

        .landing-nav-link:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .landing-nav-link.active {
          color: var(--primary-600);
          background: color-mix(in srgb, var(--primary-500) 12%, transparent);
        }

        .landing-nav-cta {
          padding: 0.65rem 1.25rem;
          background: var(--gradient-primary);
          color: white;
          text-decoration: none;
          font-weight: 700;
          font-size: 0.9rem;
          border-radius: var(--radius-lg);
          margin-left: 0.5rem;
          transition: all var(--transition-base);
        }

        .landing-nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Hero */
        .contact-hero {
          position: relative;
          padding: 160px 1.5rem 80px;
          overflow: hidden;
          background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
        }

        .contact-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .contact-hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
        }

        .contact-hero-orb-1 {
          width: 350px;
          height: 350px;
          background: var(--primary-400);
          top: -80px;
          right: -80px;
        }

        .contact-hero-orb-2 {
          width: 250px;
          height: 250px;
          background: var(--accent-500);
          bottom: -50px;
          left: -50px;
        }

        .contact-hero-content {
          position: relative;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .contact-hero-title {
          font-size: clamp(2.25rem, 5vw, 3.25rem);
          font-weight: 800;
          margin-bottom: 1.25rem;
          color: var(--text-primary);
        }

        .contact-hero-subtitle {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        /* Contact Info */
        .contact-info-section {
          padding: 0 1.5rem 60px;
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }

        .contact-info-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }

        @media (max-width: 1024px) {
          .contact-info-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .contact-info-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-info-card {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          display: flex;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .contact-info-card:hover {
          border-color: var(--primary-500);
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }

        .contact-info-icon {
          width: 52px;
          height: 52px;
          background: var(--gradient-primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .contact-info-content h3 {
          font-size: 1rem;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }

        .contact-info-main {
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-600);
          margin-bottom: 0.25rem;
        }

        .contact-info-desc {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          margin: 0;
        }

        /* Contact Form */
        .contact-form-section {
          padding: 40px 1.5rem 80px;
        }

        .contact-form-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .contact-form-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 900px) {
          .contact-form-grid {
            grid-template-columns: 1fr;
          }
        }

        .contact-form-card {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
        }

        .contact-form-header {
          margin-bottom: 2rem;
        }

        .contact-form-header h2 {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .contact-form-header p {
          color: var(--text-tertiary);
          font-size: 0.95rem;
          margin: 0;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .contact-form-row {
            grid-template-columns: 1fr;
          }
        }

        .contact-form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .contact-form-field label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .contact-form-field input,
        .contact-form-field select,
        .contact-form-field textarea {
          padding: 0.875rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--bg-quaternary);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.95rem;
          transition: all var(--transition-base);
        }

        .contact-form-field input:focus,
        .contact-form-field select:focus,
        .contact-form-field textarea:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
        }

        .contact-form-field textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-form-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-base);
          margin-top: 0.5rem;
        }

        .contact-form-submit:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .contact-form-success {
          text-align: center;
          padding: 3rem 1rem;
        }

        .contact-form-success svg {
          color: var(--success-500);
          margin-bottom: 1rem;
        }

        .contact-form-success h3 {
          font-size: 1.5rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .contact-form-success p {
          color: var(--text-secondary);
          margin: 0;
        }

        /* Sidebar */
        .contact-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-quick-card,
        .contact-social-card,
        .contact-response-card {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
        }

        .contact-quick-card h3,
        .contact-social-card h3 {
          font-size: 1.1rem;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .contact-quick-card p,
        .contact-social-card p {
          font-size: 0.9rem;
          color: var(--text-tertiary);
          margin-bottom: 1rem;
        }

        .contact-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .contact-quick-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all var(--transition-base);
        }

        .contact-quick-btn:hover {
          background: var(--bg-quaternary);
          color: var(--primary-600);
        }

        .contact-social-links {
          display: flex;
          gap: 0.75rem;
        }

        .contact-social-link {
          width: 44px;
          height: 44px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all var(--transition-base);
        }

        .contact-social-link:hover {
          background: var(--primary-500);
          color: white;
          transform: translateY(-2px);
        }

        .contact-response-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .contact-response-card svg {
          color: var(--primary-500);
        }

        .contact-response-card h4 {
          font-size: 0.95rem;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }

        .contact-response-card p {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          margin: 0;
        }

        /* FAQ */
        .faq-section {
          padding: 80px 1.5rem;
          background: var(--bg-secondary);
        }

        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .faq-header h2 {
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
        }

        .faq-header p {
          color: var(--text-secondary);
          font-size: 1.05rem;
        }

        .about-kicker {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: color-mix(in srgb, var(--primary-500) 12%, transparent);
          color: var(--primary-600);
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-radius: var(--radius-full);
          margin-bottom: 1rem;
        }

        .text-gradient {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .faq-item {
          background: var(--bg-primary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .faq-item:hover {
          border-color: var(--bg-quaternary);
        }

        .faq-item-open {
          border-color: var(--primary-500);
        }

        .faq-question {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .faq-question:hover {
          color: var(--primary-600);
        }

        .faq-question svg {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-item-open .faq-answer {
          max-height: 300px;
        }

        .faq-answer p {
          padding: 0 1.5rem 1.25rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
        }

        .faq-cta {
          text-align: center;
          margin-top: 2.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--bg-tertiary);
        }

        .faq-cta p {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          border: none;
          text-decoration: none;
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .landing-nav {
            display: none;
          }

          .contact-hero {
            padding: 120px 1.5rem 50px;
          }

          .contact-form-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

