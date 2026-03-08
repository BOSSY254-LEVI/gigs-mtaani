import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  Image,
  MapPin,
  Plus,
  Star,
  Tag,
  Upload,
  X
} from "lucide-react";
import { AppLayout } from "../components/Layout";
import { useAuthStore } from "../state/authStore";

const CATEGORIES = [
  { value: "DELIVERY", label: "Delivery", icon: "🚗" },
  { value: "TUTORING", label: "Tutoring", icon: "📚" },
  { value: "PHOTOGRAPHY", label: "Photography", icon: "📷" },
  { value: "LABOR", label: "Manual Labor", icon: "💪" },
  { value: "CLEANING", label: "Cleaning", icon: "🧹" },
  { value: "EVENT", label: "Event Staff", icon: "🎉" },
  { value: "TECH", label: "Tech Support", icon: "💻" },
  { value: "WRITING", label: "Writing", icon: "✍️" },
  { value: "OTHER", label: "Other", icon: "📋" }
];

export function AddGigPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    payAmount: "",
    currency: "KES",
    date: "",
    time: "",
    duration: "2",
    location: "",
    requirements: [] as string[],
    tags: [] as string[]
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [newTag, setNewTag] = useState("");

  const displayName = user?.profile?.displayName || user?.displayName || "Comrade";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Redirect to dashboard after success
    setTimeout(() => {
      navigate("/app");
    }, 2000);
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  if (submitted) {
    return (
      <AppLayout title="Add Gig">
        <div className="add-gig-success">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="success-content"
          >
            <div className="success-icon">
              <Plus size={48} />
            </div>
            <h2>Gig Posted Successfully! 🎉</h2>
            <p>Your gig is now live and visible to thousands of workers.</p>
            <p className="redirect-text">Redirecting to dashboard...</p>
          </motion.div>
        </div>
        <style>{`
          .add-gig-success {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .success-content {
            text-align: center;
            padding: 3rem;
          }
          .success-icon {
            width: 100px;
            height: 100px;
            background: var(--gradient-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin: 0 auto 1.5rem;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          .success-content h2 {
            font-size: 1.75rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }
          .success-content p {
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
          }
          .redirect-text {
            font-size: 0.875rem;
            color: var(--text-tertiary);
            margin-top: 1rem;
          }
        `}</style>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Add New Gig">
      <div className="add-gig-container">
        {/* Header */}
        <motion.div 
          className="add-gig-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            className="back-btn"
            onClick={() => navigate("/app")}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="header-content">
            <h1>Post a New Gig</h1>
            <p>Find the perfect worker for your task</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="add-gig-form">
          {/* Basic Info Section */}
          <motion.section 
            className="form-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="section-header">
              <div className="section-icon">
                <Tag size={20} />
              </div>
              <h2>Basic Information</h2>
            </div>

            <div className="form-grid">
              <div className="form-field full-width">
                <label>Gig Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Campus Food Delivery Rush"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-field full-width">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the task in detail..."
                  required
                  rows={4}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Pay Amount (KES) *</label>
                <div className="pay-input-wrap">
                  <DollarSign size={18} />
                  <input
                    type="number"
                    value={formData.payAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, payAmount: e.target.value }))}
                    placeholder="0"
                    min="100"
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Schedule Section */}
          <motion.section 
            className="form-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="section-header">
              <div className="section-icon">
                <Clock size={20} />
              </div>
              <h2>Schedule</h2>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label>Date *</label>
                <div className="date-input-wrap">
                  <Calendar size={18} />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label>Duration (hours)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="form-input"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours</option>
                </select>
              </div>
            </div>
          </motion.section>

          {/* Location Section */}
          <motion.section 
            className="form-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="section-header">
              <div className="section-icon">
                <MapPin size={20} />
              </div>
              <h2>Location</h2>
            </div>

            <div className="form-grid">
              <div className="form-field full-width">
                <label>Address / Location *</label>
                <div className="location-input-wrap">
                  <MapPin size={18} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Westlands, Near UWC"
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Requirements Section */}
          <motion.section 
            className="form-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="section-header">
              <div className="section-icon">
                <Star size={20} />
              </div>
              <h2>Requirements & Tags</h2>
            </div>

            <div className="tags-section">
              <div className="tag-input-group">
                <label>Requirements</label>
                <div className="tag-input-wrap">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                    placeholder="Add a requirement..."
                    className="form-input"
                  />
                  <button type="button" onClick={addRequirement} className="add-tag-btn">
                    <Plus size={16} />
                  </button>
                </div>
                {formData.requirements.length > 0 && (
                  <div className="tags-list">
                    {formData.requirements.map((req, index) => (
                      <span key={index} className="tag-item">
                        {req}
                        <button type="button" onClick={() => removeRequirement(index)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="tag-input-group">
                <label>Tags</label>
                <div className="tag-input-wrap">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="form-input"
                  />
                  <button type="button" onClick={addTag} className="add-tag-btn">
                    <Plus size={16} />
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="tags-list">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="tag-item tag-blue">
                        {tag}
                        <button type="button" onClick={() => removeTag(index)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Submit Section */}
          <motion.div 
            className="form-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate("/app")}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Posting Gig...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Post Gig
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>

      <style>{`
        .add-gig-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .add-gig-header {
          margin-bottom: 2rem;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--bg-quaternary);
          border-radius: var(--radius-lg);
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1rem;
          transition: all var(--transition-base);
        }

        .back-btn:hover {
          background: var(--bg-quaternary);
          color: var(--text-primary);
        }

        .header-content h1 {
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .header-content p {
          color: var(--text-secondary);
        }

        .add-gig-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-section {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          background: var(--gradient-primary);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .section-header h2 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-input {
          padding: 0.875rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--bg-quaternary);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.95rem;
          transition: all var(--transition-base);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
        }

        .form-input::placeholder {
          color: var(--text-tertiary);
        }

        textarea.form-input {
          resize: vertical;
          min-height: 100px;
        }

        .pay-input-wrap,
        .date-input-wrap,
        .location-input-wrap {
          position: relative;
        }

        .pay-input-wrap svg,
        .date-input-wrap svg,
        .location-input-wrap svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-tertiary);
        }

        .pay-input-wrap input,
        .date-input-wrap input,
        .location-input-wrap input {
          padding-left: 2.75rem;
        }

        .tags-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .tag-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tag-input-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .tag-input-wrap {
          display: flex;
          gap: 0.5rem;
        }

        .tag-input-wrap input {
          flex: 1;
        }

        .add-tag-btn {
          padding: 0 1rem;
          background: var(--gradient-primary);
          border: none;
          border-radius: var(--radius-lg);
          color: white;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .add-tag-btn:hover {
          transform: scale(1.05);
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .tag-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--bg-quaternary);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .tag-item.tag-blue {
          background: color-mix(in srgb, var(--primary-500) 15%, transparent);
          border-color: color-mix(in srgb, var(--primary-500) 30%, transparent);
          color: var(--primary-600);
        }

        .tag-item button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--text-tertiary);
          cursor: pointer;
          padding: 0;
        }

        .tag-item button:hover {
          color: var(--danger-500);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1rem;
        }

        .submit-btn {
          min-width: 160px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          border: none;
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          border: 1px solid var(--bg-quaternary);
        }

        .btn-secondary:hover {
          background: var(--bg-quaternary);
          color: var(--text-primary);
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1rem;
        }
      `}</style>
    </AppLayout>
  );
}

export default AddGigPage;

