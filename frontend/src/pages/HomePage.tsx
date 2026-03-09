import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  MapPin,
  ChevronDown,
  MessageCircle,
  Phone,
  Play,
  Users,
  Award,
  TrendingUp,
  Wallet,
  Sparkles,
  Bike,
  GraduationCap,
  Truck,
  PartyPopper,
  Camera,
  Paintbrush,
  Code2,
  PenLine,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Loader2
} from "lucide-react";
import { Footer } from "./Footer";
import { Navigation } from "../components/Navigation";

// ==================== UTILITY COMPONENTS ====================

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Scroll Reveal Wrapper
function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Glass Card Component
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
}

// FAQ Accordion Item
function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div 
      className="faq-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button className="faq-question" onClick={onToggle}>
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="faq-answer"
          >
            <p>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Testimonial Carousel
function TestimonialCarousel({ testimonials }: { testimonials: typeof defaultTestimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="testimonial-carousel">
      <div className="carousel-container">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="carousel-slide"
          >
            <div className="testimonial-card-large">
              <div className="testimonial-quote-large">
                <Quote size={48} />
              </div>
              <p className="testimonial-text-large">{testimonials[currentIndex].quote}</p>
              <div className="testimonial-author-large">
                <div className="testimonial-avatar-large">{testimonials[currentIndex].avatar}</div>
                <div>
                  <h4>{testimonials[currentIndex].author}</h4>
                  <span>{testimonials[currentIndex].role}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="carousel-controls">
        <button onClick={prev} className="carousel-btn" aria-label="Previous">
          <ChevronLeft size={20} />
        </button>
        <div className="carousel-dots">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); }}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
        <button onClick={next} className="carousel-btn" aria-label="Next">
          <ChevronRightIcon size={20} />
        </button>
      </div>
    </div>
  );
}

// Floating Action Button
function FloatingActionButton({ icon: Icon, label, onClick, color = "#25D366" }: { icon: any; label: string; onClick: () => void; color?: string }) {
  return (
    <motion.button
      className="fab-button"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      style={{ background: color }}
    >
      <Icon size={24} color="white" />
      <span className="fab-label">{label}</span>
    </motion.button>
  );
}

// Particle Background
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="particle-background" />;
}

// Confetti Effect
function ConfettiEffect() {
  const [particles, setParticles] = useState<{ x: number; y: number; vx: number; vy: number; color: string; rotation: number }[]>([]);

  useEffect(() => {
    const colors = ["#06b6d4", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];
    const newParticles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => setParticles([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="confetti-container">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="confetti-particle"
          initial={{ x: p.x, y: p.y, rotate: 0, opacity: 1 }}
          animate={{ 
            x: p.x + p.vx * 50, 
            y: window.innerHeight + 50, 
            rotate: p.rotation + 720 
          }}
          transition={{ duration: 4, ease: "linear" }}
          style={{ 
            position: "fixed", 
            width: 10, 
            height: 10, 
            background: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "0"
          }}
        />
      ))}
    </div>
  );
}

// Time-based Greeting
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// ==================== DATA ====================

const defaultFeatures = [
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
  { value: 10000, suffix: "+", label: "Active Gigs", icon: BriefcaseBusiness },
  { value: 5000, suffix: "+", label: "Verified Workers", icon: Users },
  { value: 50, suffix: "+", label: "Campuses", icon: GraduationCap },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: Award }
];

const defaultTestimonials = [
  {
    quote: "Gigs Mtaani changed my life! I can now work around my classes and earn money for my tuition. The flexibility is amazing.",
    author: "Sarah W.",
    role: "University Student",
    avatar: "S"
  },
  {
    quote: "As a business owner, I found reliable help within hours. The quality of workers is impressive. Highly recommended!",
    author: "James M.",
    role: "Business Owner",
    avatar: "J"
  },
  {
    quote: "The payment process is seamless. I've never had any issues getting paid on time. Best gig platform in Kenya!",
    author: "Emily K.",
    role: "Freelancer",
    avatar: "E"
  },
  {
    quote: "I found my first part-time job within days of signing up. The verification process gave me confidence.",
    author: "David L.",
    role: "College Student",
    avatar: "D"
  }
];

const defaultCategories = [
  { label: "Delivery", icon: Bike, to: "/auth", color: "#06b6d4" },
  { label: "Tutoring", icon: GraduationCap, to: "/auth", color: "#8b5cf6" },
  { label: "Cleaning", icon: Sparkles, to: "/auth", color: "#10b981" },
  { label: "Moving", icon: Truck, to: "/auth", color: "#f59e0b" },
  { label: "Event Staff", icon: PartyPopper, to: "/auth", color: "#ec4899" },
  { label: "Photography", icon: Camera, to: "/auth", color: "#6366f1" },
  { label: "Graphic Design", icon: Paintbrush, to: "/auth", color: "#14b8a6" },
  { label: "Web Dev", icon: Code2, to: "/auth", color: "#f97316" },
];

const faqs = [
  {
    question: "How do I get started with Gigs Mtaani?",
    answer: "Simply create an account, verify your email, and start browsing available gigs in your area. You can apply to gigs that match your skills and schedule."
  },
  {
    question: "How do payments work?",
    answer: "Payments are processed securely through M-PESA. Once a gig is completed and approved, you'll receive payment within 24-48 hours directly to your M-PESA number."
  },
  {
    question: "Is there a fee to join?",
    answer: "No! Joining Gigs Mtaani is completely free. We only charge a small service fee from the business owners who post gigs."
  },
  {
    question: "How do I verify my account?",
    answer: "After signing up, you'll receive a confirmation email. Click the link to verify your account. Some gigs may require additional verification for security."
  },
  {
    question: "Can I work multiple gigs at once?",
    answer: "Absolutely! You can take on as many gigs as you can handle. Just make sure you can commit to the deadlines for each job."
  }
];

const trustBadges = [
  { name: "SafePay", icon: Shield },
  { name: "Verified Workers", icon: CheckCircle2 },
  { name: "M-PESA Powered", icon: Wallet },
  { name: "24/7 Support", icon: MessageCircle }
];

// ==================== MAIN COMPONENT ====================

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Delivery");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [greeting] = useState(getTimeBasedGreeting());
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/254721373455", "_blank");
  };

  const handleCallClick = () => {
    window.location.href = "tel:+254700000000";
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="loading-content"
        >
          <div className="loading-logo">
            <BriefcaseBusiness size={60} color="#06b6d4" />
          </div>
          <Loader2 className="loading-spinner" size={40} />
          <p>Loading Gigs Mtaani...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="landing-page-enhanced">
      {showConfetti && <ConfettiEffect />}
      
      {/* Particle Background */}
      <ParticleBackground />

      {/* Navigation */}
      <Navigation />

      {/* ===================== HERO SECTION ===================== */}
      <section className="hero-section-enhanced">
        <div className="hero-bg-shapes">
          <motion.div 
            className="hero-shape shape-1"
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="hero-shape shape-2"
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="hero-shape shape-3"
            animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="hero-container-enhanced">
          {/* LEFT: Text Content */}
          <div className="hero-content">
            {/* Time-based Badge */}
            <motion.span 
              className="hero-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="hero-badge-dot"></span>
              {greeting}! Kenya's #1 Gig Platform
            </motion.span>

            {/* Title */}
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Find Flexible Work <br />
              <span className="hero-title-highlight">On Your Terms</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Connect with thousands of gigs and opportunities. Join Kenya's #1
              platform for students and freelancers. Earn extra cash while you
              study or build your portfolio.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.button 
                className="hero-btn-primary"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(6, 182, 212, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConfetti(true)}
              >
                Get Started Free
                <ArrowRight size={18} />
              </motion.button>
              <Link to="/about" className="hero-btn-secondary">
                Learn More
                <Play size={16} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="hero-stats-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {[
                { value: "10K+", label: "ACTIVE GIGS" },
                { value: "5K+",  label: "WORKERS" },
                { value: "98%",  label: "SATISFACTION" },
              ].map((s) => (
                <motion.div 
                  key={s.label} 
                  className="hero-stat-box"
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <span className="hero-stat-val">{s.value}</span>
                  <span className="hero-stat-lbl">{s.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Success Card Stack */}
          <div className="hero-visual">
            <motion.div 
              className="success-card-stack"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {/* Main Card */}
              <motion.div 
                className="success-card-main"
                animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="sc-top-row">
                  <div className="sc-stars">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg 
                        key={i} 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="#f59e0b"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </motion.svg>
                    ))}
                    <span className="sc-rating-num">5.0</span>
                  </div>
                  <span className="sc-payment-badge">
                    <CheckCircle2 size={13} />
                    Payment Received
                  </span>
                </div>

                <div className="sc-worker-row">
                  <div className="sc-avatars">
                    <div className="sc-avatar">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfRW1fz4B26L5bm3z2OjxHCeApsvVMHGMs3AOPrDDtJxy_-uqw5KxzIdjO98PlAlhjmAiHNOmV-GrQNsxfYWOA1O74dXoeflvjOBCO99vLwdsED-wys78YNfkILc86da_EjRBPByMtFFV1sIZV2SPYeNCG9rgCfhM2FYyYYFPQJQR5XEnTEySWds8sswVhZdV7hUQbwSTDC3OHjhlpp2Q2E_4jwTvG7RUWt-bmju8_AHRfMwRyHcJmV4nWo606bw404_IKy77a9c8" alt="avatar" />
                    </div>
                    <div className="sc-avatar sc-avatar-2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDInlhgFA3yheXPe6LYtk5DPHs2NP5D2diR5OdxTuYrUenDJhbJBRQHlqqWbEMRKAQFJGN4eNs2YebMg3Ta2dm0SO-kF2Oov7rUXPLxdQh-2VW8hp4aykn16Cn5qJ8Rx3Ot4ko1WjCYjtzO3twD9yI5NMf_bqQ_YvvtFQxLeo57KYTPzhsMcqNu89wj-F6OKTsnLHDe6MK19r0jlFCnOlnQqdUzZSp-VNAvMRRULho3p7p9_B61_5nk4Ef0E3cWoVUpyLtE7Bs13EY')", backgroundSize: "cover", backgroundPosition: "center" }} />
                  </div>
                  <div>
                    <div className="sc-worker-name">Slim Shady</div>
                    <div className="sc-worker-sub">Verified Worker <span className="sc-online-dot">●</span> 4.9</div>
                  </div>
                </div>

                <div className="sc-gig-box">
                  <div>
                    <div className="sc-gig-label">COMPLETED GIG</div>
                    <div className="sc-gig-title">Office Cleaning</div>
                    <div className="sc-gig-location"><MapPin size={13} /> Westlands, Nairobi</div>
                  </div>
                  <div className="sc-gig-price">
                    <div className="sc-price-val">KSh 2,500</div>
                    <div className="sc-paid-label">PAID INSTANTLY</div>
                  </div>
                </div>

                <div className="sc-progress">
                  <div className="sc-bar sc-bar-active"></div>
                  <div className="sc-bar sc-bar-inactive"></div>
                  <div className="sc-bar sc-bar-inactive"></div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                className="floating-card card-1"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <TrendingUp size={20} color="#10b981" />
                <div>
                  <span className="fc-label">Earnings</span>
                  <span className="fc-value">KSh 12,500</span>
                </div>
              </motion.div>

              <motion.div 
                className="floating-card card-2"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Award size={20} color="#f59e0b" />
                <div>
                  <span className="fc-label">Top Rated</span>
                  <span className="fc-value">Worker</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ===================== END HERO ===================== */}

      {/* ===================== CATEGORIES ===================== */}
      <section className="categories-section">
        <ScrollReveal>
          <div className="categories-header">
            <h3>Popular Categories</h3>
            <p>Explore gigs based on your skills</p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.1}>
          <div className="categories-grid">
            {defaultCategories.map(({ label, icon: Icon, color }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`category-card ${activeCategory === label ? 'active' : ''}`}
                onClick={() => setActiveCategory(label)}
                style={{ '--accent-color': color } as React.CSSProperties}
              >
                <div className="category-icon">
                  <Icon size={24} />
                </div>
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ===================== TRUST BADGES ===================== */}
      <section className="trust-section">
        <ScrollReveal>
          <div className="trust-container">
            <p className="trust-label">Trusted by thousands across Kenya</p>
            <div className="trust-badges">
              {trustBadges.map(({ name, icon: Icon }, index) => (
                <motion.div 
                  key={name}
                  className="trust-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon size={24} />
                  <span>{name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="features-section">
        <div className="features-container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-kicker">Why Choose Us</span>
              <h2 className="section-title">
                Everything You Need to <span className="text-gradient">Succeed</span>
              </h2>
              <p className="section-subtitle">
                We provide all the tools and support you need to find work and get paid securely
              </p>
            </div>
          </ScrollReveal>
          
          <div className="features-grid">
            {defaultFeatures.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <GlassCard>
                  <div className="feature-icon">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="how-section">
        <div className="how-container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-kicker">Simple Process</span>
              <h2 className="section-title">How <span className="text-gradient">It Works</span></h2>
              <p className="section-subtitle">Get started in minutes and start earning</p>
            </div>
          </ScrollReveal>
          
          <div className="how-steps">
            <div className="how-steps-line">
              <motion.div 
                className="how-steps-progress"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            {howItWorks.map((step, index) => (
              <ScrollReveal key={index} delay={index * 0.15}>
                <motion.div 
                  className="how-step"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="how-step-number">{step.step}</div>
                  <div className="how-step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== STATS SECTION ===================== */}
      <section className="stats-section">
        <div className="stats-bg"></div>
        <div className="stats-container">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="stat-item">
                <div className="stat-icon">
                  <stat.icon size={28} />
                </div>
                <span className="stat-value">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-kicker">Testimonials</span>
              <h2 className="section-title">
                What Our Users <span className="text-gradient">Say</span>
              </h2>
              <p className="section-subtitle">
                Join thousands of satisfied workers and clients
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <TestimonialCarousel testimonials={defaultTestimonials} />
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="faq-section">
        <div className="faq-container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-kicker">Questions?</span>
              <h2 className="section-title">
                Frequently <span className="text-gradient">Asked</span>
              </h2>
              <p className="section-subtitle">
                Everything you need to know about Gigs Mtaani
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===================== CTA SECTION ===================== */}
      <section className="cta-section">
        <div className="cta-glow cta-glow-1"></div>
        <div className="cta-glow cta-glow-2"></div>
        <ScrollReveal>
          <div className="cta-container">
            <div className="cta-content">
              <span className="cta-badge">⚡ Limited Time Offer</span>
              <h2>Ready to Start Earning?</h2>
              <p>Join thousands of workers already earning with Gigs Mtaani. It takes less than 2 minutes to sign up.</p>
              <div className="cta-features">
                <div className="cta-feature"><CheckCircle2 size={16} /> No registration fee</div>
                <div className="cta-feature"><CheckCircle2 size={16} /> Instant M-PESA payouts</div>
                <div className="cta-feature"><CheckCircle2 size={16} /> Verified gigs only</div>
              </div>
              <div className="cta-actions">
                <motion.button 
                  className="btn btn-primary btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfetti(true)}
                >
                  Create Free Account
                  <ArrowRight size={18} />
                </motion.button>
                <Link to="/contact" className="btn btn-secondary btn-lg">
                  Have Questions?
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===================== FLOATING ACTION BUTTONS ===================== */}
      <div className="fab-container">
        <FloatingActionButton 
          icon={MessageCircle} 
          label="Chat on WhatsApp" 
          onClick={handleWhatsAppClick}
          color="#25D366"
        />
        <FloatingActionButton 
          icon={Phone} 
          label="Call Us" 
          onClick={handleCallClick}
          color="#06b6d4"
        />
      </div>

      {/* Footer */}
      <Footer />

      {/* ===================== STYLES ===================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        :root {
          --primary: #06b6d4;
          --primary-dark: #0891b2;
          --accent: #f59e0b;
          --success: #10b981;
          --bg-light: #f8fafc;
          --dark-text: #164e63;
          --white: #ffffff;
          --muted-text: #64748b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-page-enhanced {
          min-height: 100vh;
          background: var(--bg-light);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Particle Background */
        .particle-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        /* Loading Screen */
        .loading-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #f5f8f8 100%);
        }

        .loading-content { text-align: center; }
        .loading-logo { margin-bottom: 20px; }
        .loading-spinner { animation: spin 1s linear infinite; color: var(--primary); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .loading-content p { margin-top: 16px; color: var(--muted-text); font-weight: 600; }

        /* Hero Section */
        .hero-section-enhanced {
          position: relative;
          min-height: 620px;
          padding: 80px 40px 60px;
          background: linear-gradient(135deg, #f0f9ff 0%, #f5f8f8 40%, #e8f5f8 100%);
          overflow: hidden;
        }

        .hero-bg-shapes {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .hero-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
        }

        .shape-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%);
          top: -100px;
          right: 10%;
        }

        .shape-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.2), transparent 70%);
          bottom: -50px;
          left: 5%;
        }

        .shape-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2), transparent 70%);
          top: 40%;
          left: 30%;
        }

        .hero-container-enhanced {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .hero-container-enhanced { grid-template-columns: 1fr; text-align: center; }
          .hero-visual { display: none; }
          .hero-stats-row { justify-content: center; }
          .hero-actions { justify-content: center; }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(6, 182, 212, 0.1);
          color: var(--primary);
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 18px;
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .hero-badge-dot {
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          position: relative;
        }

        .hero-badge-dot::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--primary);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(2); opacity: 0; }
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--dark-text);
          margin-bottom: 20px;
        }

        .hero-title-highlight {
          color: var(--primary);
          position: relative;
        }

        .hero-title-highlight::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, rgba(6, 182, 212, 0.3), transparent);
          z-index: -1;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--muted-text);
          line-height: 1.8;
          max-width: 480px;
          margin-bottom: 28px;
        }

        @media (max-width: 1024px) {
          .hero-subtitle { margin: 0 auto 28px; }
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 25px rgba(6, 182, 212, 0.35);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-btn-primary:hover {
          box-shadow: 0 15px 40px rgba(6, 182, 212, 0.45);
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: white;
          color: var(--dark-text);
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .hero-btn-secondary:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .hero-stats-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-stat-box {
          background: white;
          border-radius: 14px;
          padding: 18px 22px;
          border: 1px solid rgba(6, 182, 212, 0.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .hero-stat-val {
          display: block;
          font-size: 1.75rem;
          font-weight: 900;
          color: var(--primary);
        }

        .hero-stat-lbl {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }

        /* Success Card Stack */
        .hero-visual {
          display: flex;
          justify-content: center;
        }

        .success-card-stack {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: 350px;
        }

        .success-card-main {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 380px;
          background: white;
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.1);
        }

        .floating-card {
          position: absolute;
          background: white;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #f1f5f9;
        }

        .card-1 { top: 20px; right: -20px; }
        .card-2 { bottom: 30px; left: -30px; }

        .fc-label { display: block; font-size: 0.7rem; color: var(--muted-text); }
        .fc-value { display: block; font-size: 0.95rem; font-weight: 800; color: var(--dark-text); }

        .sc-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .sc-stars { display: flex; align-items: center; gap: 2px; }
        .sc-rating-num { font-weight: 800; color: var(--dark-text); margin-left: 6px; }

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

        .sc-worker-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
        }

        .sc-avatars { display: flex; }

        .sc-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 3px solid white;
          overflow: hidden;
          margin-right: -12px;
          flex-shrink: 0;
        }

        .sc-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .sc-worker-name { font-weight: 700; color: #0f172a; }
        .sc-worker-sub { font-size: 0.78rem; color: var(--muted-text); display: flex; align-items: center; gap: 4px; }
        .sc-online-dot { color: var(--success); font-size: 10px; }

        .sc-gig-box {
          background: #f8fafc;
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .sc-gig-label { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; }
        .sc-gig-title { font-weight: 700; color: var(--dark-text); margin: 4px 0; }
        .sc-gig-location { font-size: 0.78rem; color: var(--muted-text); display: flex; align-items: center; gap: 3px; }

        .sc-price-val { font-size: 1.25rem; font-weight: 900; color: var(--primary); }
        .sc-paid-label { font-size: 0.58rem; font-weight: 700; color: #059669; text-transform: uppercase; text-align: right; }

        .sc-progress { display: flex; gap: 6px; }
        .sc-bar { flex: 1; height: 4px; border-radius: 9999px; }
        .sc-bar-active { background: var(--primary); }
        .sc-bar-inactive { background: #e2e8f0; }

        /* Categories Section */
        .categories-section {
          padding: 50px 40px;
          background: white;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }

        .categories-header { text-align: center; margin-bottom: 35px; }
        .categories-header h3 { font-size: 1.5rem; font-weight: 800; color: var(--dark-text); margin-bottom: 6px; }
        .categories-header p { color: var(--muted-text); }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px 16px;
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-card:hover,
        .category-card.active {
          border-color: var(--accent-color, var(--primary));
          background: rgba(6, 182, 212, 0.03);
        }

        .category-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--accent-color, var(--primary)), var(--primary-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: transform 0.3s ease;
        }

        .category-card:hover .category-icon { transform: scale(1.1) rotate(5deg); }
        .category-card span { font-weight: 600; color: var(--dark-text); font-size: 0.9rem; }

        /* Trust Section */
        .trust-section {
          padding: 30px 40px;
          background: linear-gradient(135deg, #f0f9ff, #f5f8f8);
          border-bottom: 1px solid #f1f5f9;
        }

        .trust-container { max-width: 800px; margin: 0 auto; text-align: center; }
        .trust-label { font-size: 0.85rem; color: var(--muted-text); margin-bottom: 20px; font-weight: 600; }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: white;
          border-radius: 9999px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          font-weight: 600;
          color: var(--dark-text);
          font-size: 0.85rem;
        }

        .trust-badge svg { color: var(--primary); }

        /* Section Common */
        .section-header { text-align: center; margin-bottom: 3.5rem; }

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
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: var(--dark-text);
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: var(--muted-text);
          max-width: 550px;
          margin: 0 auto;
        }

        .text-gradient {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Features */
        .features-section { padding: 80px 40px; }
        .features-container { max-width: 1200px; margin: 0 auto; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .features-grid { grid-template-columns: 1fr; } }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 28px;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(6, 182, 212, 0.15);
          border-color: var(--primary);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--primary), #0891b2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 16px;
        }

        .feature-title { font-size: 1.15rem; color: var(--dark-text); margin-bottom: 8px; font-weight: 700; }
        .feature-desc { font-size: 0.9rem; color: var(--muted-text); line-height: 1.6; }

        /* How It Works */
        .how-section {
          padding: 80px 40px;
          background: white;
        }

        .how-container { max-width: 1100px; margin: 0 auto; }

        .how-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          position: relative;
        }

        @media (max-width: 900px) { .how-steps { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .how-steps { grid-template-columns: 1fr; } }

        .how-steps-line {
          position: absolute;
          top: 50px;
          left: 10%;
          right: 10%;
          height: 3px;
          background: #e2e8f0;
          z-index: 0;
        }

        .how-steps-progress {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          transform-origin: left;
        }

        .how-step {
          position: relative;
          z-index: 1;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .how-step:hover {
          border-color: var(--primary);
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(6, 182, 212, 0.15);
        }

        .how-step-number {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }

        .how-step-content h3 { font-size: 1rem; color: var(--dark-text); margin-bottom: 8px; font-weight: 700; }
        .how-step-content p { font-size: 0.85rem; color: var(--muted-text); line-height: 1.5; }

        /* Stats Section */
        .stats-section {
          position: relative;
          padding: 60px 40px;
          background: linear-gradient(135deg, var(--primary), #0d9488);
          overflow: hidden;
        }

        .stats-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 50%);
        }

        .stats-container {
          position: relative;
          z-index: 2;
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }

        @media (max-width: 640px) { .stats-container { grid-template-columns: repeat(2, 1fr); } }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
        }

        .stat-label {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.8);
        }

        /* Testimonials */
        .testimonials-section { padding: 80px 40px; }
        .testimonials-container { max-width: 800px; margin: 0 auto; }

        .testimonial-carousel {
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .carousel-container { position: relative; overflow: hidden; min-height: 250px; }

        .testimonial-card-large { text-align: center; }

        .testimonial-quote-large {
          color: var(--primary);
          opacity: 0.2;
          margin-bottom: 20px;
        }

        .testimonial-text-large {
          font-size: 1.2rem;
          color: var(--dark-text);
          line-height: 1.7;
          margin-bottom: 24px;
          font-style: italic;
        }

        .testimonial-author-large {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .testimonial-avatar-large {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--primary), #0891b2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .testimonial-author-large h4 { font-size: 1rem; color: var(--dark-text); margin-bottom: 2px; }
        .testimonial-author-large span { font-size: 0.85rem; color: var(--muted-text); }

        .carousel-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }

        .carousel-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .carousel-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .carousel-dots { display: flex; gap: 8px; }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e2e8f0;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .carousel-dot.active { background: var(--primary); width: 24px; border-radius: 4px; }

        /* FAQ Section */
        .faq-section { padding: 80px 40px; background: #f8fafc; }
        .faq-container { max-width: 700px; margin: 0 auto; }

        .faq-list { display: flex; flex-direction: column; gap: 12px; }

        .faq-item {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          color: var(--dark-text);
          text-align: left;
        }

        .faq-question:hover { color: var(--primary); }

        .faq-answer { padding: 0 20px 18px; }
        .faq-answer p { font-size: 0.95rem; color: var(--muted-text); line-height: 1.6; }

        /* CTA Section */
        .cta-section {
          padding: 80px 40px;
          background: linear-gradient(135deg, #f0f9ff, #e8f5f8);
          position: relative;
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
        }

        .cta-glow-1 {
          width: 400px;
          height: 400px;
          background: var(--primary);
          top: -100px;
          right: -100px;
        }

        .cta-glow-2 {
          width: 300px;
          height: 300px;
          background: var(--accent);
          bottom: -50px;
          left: -50px;
        }

        .cta-container {
          position: relative;
          z-index: 2;
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(245, 158, 11, 0.15);
          color: #d97706;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .cta-content h2 {
          font-size: 2.25rem;
          color: var(--dark-text);
          margin-bottom: 12px;
          font-weight: 800;
        }

        .cta-content p {
          font-size: 1.1rem;
          color: var(--muted-text);
          margin-bottom: 24px;
        }

        .cta-features {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .cta-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--dark-text);
          font-weight: 600;
        }

        .cta-feature svg { color: var(--success); }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary), #0891b2);
          color: white;
          box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
        }

        .btn-primary:hover { box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4); }

        .btn-secondary {
          background: white;
          color: var(--dark-text);
          border: 2px solid #e2e8f0;
        }

        .btn-secondary:hover { border-color: var(--primary); color: var(--primary); }
        .btn-lg { padding: 14px 32px; font-size: 1.05rem; }

        /* Floating Action Buttons */
        .fab-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 1000;
        }

        .fab-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .fab-button:hover { box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); }

        .fab-label {
          color: white;
          font-weight: 600;
          font-size: 0.85rem;
        }

        /* Confetti */
        .confetti-container { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section-enhanced { padding: 60px 20px 40px; }
          .categories-section { padding: 40px 20px; }
          .features-section { padding: 60px 20px; }
          .how-section { padding: 60px 20px; }
          .stats-section { padding: 40px 20px; }
          .testimonials-section { padding: 60px 20px; }
          .faq-section { padding: 60px 20px; }
          .cta-section { padding: 60px 20px; }
        }
      `}</style>
    </div>
  );
}

