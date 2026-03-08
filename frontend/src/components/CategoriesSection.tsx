import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bike, GraduationCap, Sparkles, Truck,
  PartyPopper, Camera, Paintbrush, Code2,
  PenLine, ChevronRight,
} from "lucide-react";

export function CategoriesSection() {
  const [active, setActive] = useState("Delivery");

  const categories = [
    { label: "Delivery",       icon: Bike,          to: "/auth" },
    { label: "Tutoring",       icon: GraduationCap, to: "/auth" },
    { label: "Cleaning",       icon: Sparkles,      to: "/auth" },
    { label: "Moving",         icon: Truck,         to: "/auth" },
    { label: "Event Staff",    icon: PartyPopper,   to: "/auth" },
    { label: "Photography",    icon: Camera,        to: "/auth" },
    { label: "Graphic Design", icon: Paintbrush,    to: "/auth" },
    { label: "Web Dev",        icon: Code2,         to: "/auth" },

  ];

  return (
    <section style={{
      background: "white",
      borderTop: "1px solid #f1f5f9",
      borderBottom: "1px solid #f1f5f9",
      padding: "28px 40px",
    }}>
      <style>{`
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .cat-pill {
          transition: all 0.18s ease;
          text-decoration: none;
          font-family: inherit;
        }

        .cat-pill:hover {
          border-color: #06b6d4 !important;
          color: #06b6d4 !important;
          background: rgba(6,182,212,0.04) !important;
        }

        .cat-pill-active:hover {
          color: white !important;
          background: #06b6d4 !important;
        }

        .view-all-link:hover { text-decoration: underline; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 20,
        }}>
          <div>
            <h3 style={{
              fontSize: "1.2rem", fontWeight: 800,
              color: "#164e63", margin: "0 0 3px",
            }}>
              Popular Categories
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>
              Explore gigs based on your skills
            </p>
          </div>
          <Link
            to="/auth"
            className="view-all-link"
            style={{
              display: "flex", alignItems: "center", gap: 3,
              color: "#06b6d4", fontWeight: 700, fontSize: "0.875rem",
              textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {/* Pills Row */}
        <div className="cat-scroll" style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2 }}>
          {categories.map(({ label, icon: Icon, to }) => {
            const isActive = active === label;
            return (
              <Link
                key={label}
                to={to}
                className={`cat-pill ${isActive ? "cat-pill-active" : ""}`}
                onClick={() => setActive(label)}
                style={{
                  whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "10px 18px", borderRadius: 10,
                  fontWeight: 600, fontSize: "0.875rem",
                  border: isActive ? "none" : "1px solid #e2e8f0",
                  background: isActive ? "#06b6d4" : "white",
                  color: isActive ? "white" : "#164e63",
                  boxShadow: isActive
                    ? "0 4px 12px rgba(6,182,212,0.28)"
                    : "0 1px 2px rgba(0,0,0,0.04)",
                  flexShrink: 0,
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}