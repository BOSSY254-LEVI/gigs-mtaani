import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "../components/Layout";
import { GigCard } from "../components/GigCard";
import { NewGigForm } from "../components/NewGigForm";
import { ChatPanel } from "../components/ChatPanel";
import { WalletPanel } from "../components/WalletPanel";
import { SafetyPanel } from "../components/SafetyPanel";
import { AdminPanel } from "../components/AdminPanel";
import { ChatInterface } from "../components/ChatInterface";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAuthStore } from "../state/authStore";
import { useThemeStore } from "../state/themeStore";

// Mock data for demo mode
const MOCK_GIGS = [
  {
    id: "1",
    title: "Campus Food Delivery",
    description: "Deliver lunch orders from cafeteria to dormitories. Flexible hours, daily payments.",
    category: "DELIVERY",
    payAmount: 500,
    currency: "KES",
    latitude: -1.2921,
    longitude: 36.8219,
    radiusMeters: 1000,
    startsAt: new Date(Date.now() + 3600000).toISOString(),
    poster: { profile: { displayName: "John D." } },
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Math Tutoring - Calculus I",
    description: "Need help with calculus. Looking for peer tutor available evenings.",
    category: "TUTORING",
    payAmount: 800,
    currency: "KES",
    latitude: -1.2921,
    longitude: 36.8219,
    radiusMeters: 2000,
    startsAt: new Date(Date.now() + 7200000).toISOString(),
    poster: { profile: { displayName: "Sarah M." } },
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Event Photography",
    description: "Capture photos at campus cultural festival. Equipment provided.",
    category: "PHOTOGRAPHY",
    payAmount: 2000,
    currency: "KES",
    latitude: -1.2921,
    longitude: 36.8219,
    radiusMeters: 3000,
    startsAt: new Date(Date.now() + 86400000).toISOString(),
    poster: { profile: { displayName: "Mike R." } },
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Library Book Organizer",
    description: "Help organize books in the main library. Weekend work.",
    category: "GENERAL",
    payAmount: 400,
    currency: "KES",
    latitude: -1.2921,
    longitude: 36.8219,
    radiusMeters: 500,
    startsAt: new Date(Date.now() + 172800000).toISOString(),
    poster: { profile: { displayName: "Library" } },
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Moving Help - Dorm Switch",
    description: "Need help moving furniture to new dorm room. 2-hour job.",
    category: "LABOR",
    payAmount: 600,
    currency: "KES",
    latitude: -1.2921,
    longitude: 36.8219,
    radiusMeters: 1500,
    startsAt: new Date(Date.now() + 259200000).toISOString(),
    poster: { profile: { displayName: "Emily K." } },
    status: "OPEN",
    createdAt: new Date().toISOString()
  }
];

const MOCK_WALLETS = [
  { id: "wallet-1", currency: "KES", available: 2500, pending: 500 },
  { id: "wallet-2", currency: "USD", available: 15.50, pending: 0 }
];

const MOCK_SESSIONS = [];

export function DashboardPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const geo = useGeolocation();

  const [feedMode, setFeedMode] = useState<"MY_LOCATION" | "GENERAL">("MY_LOCATION");
  const [radiusMeters, setRadiusMeters] = useState(5000);

  // Use mock data in demo mode
  const feedQuery = useQuery({
    queryKey: ["feed", feedMode, geo.latitude, geo.longitude, radiusMeters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { gigs: MOCK_GIGS };
    },
    refetchInterval: 30000
  });

  const walletQuery = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { wallets: MOCK_WALLETS };
    },
    refetchInterval: 20000
  });

  const safetyQuery = useQuery({
    queryKey: ["safety"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { sessions: MOCK_SESSIONS };
    },
    refetchInterval: 20000
  });

  const showAdmin = useMemo(() => ["ADMIN", "MODERATOR", "RISK_OPS", "FINANCE_OPS"].includes(user?.role ?? ""), [user?.role]);

const adminMetricsQuery = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: async () => ({
      totals: {
        totalUsers: 1250,
        activeGigs: 45,
        completedToday: 12,
        disputes: 2
      }
    }),
    enabled: showAdmin,
    refetchInterval: 30000
  });

  const riskDashboardQuery = useQuery({
    queryKey: ["risk-dashboard"],
    queryFn: async () => ({
      counts: {
        highRisk: 3,
        mediumRisk: 12,
        lowRisk: 95
      }
    }),
    enabled: showAdmin,
    refetchInterval: 30000
  });

  const applyMutation = useMutation({
    mutationFn: async (gigId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, gigId };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] })
  });

  const createGigMutation = useMutation({
    mutationFn: async (payload: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["my-posted"] });
    }
  });

  const topupMutation = useMutation({
    mutationFn: async (amount: number) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, amount };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wallet"] })
  });

  const sosMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["safety"] })
  });

  return (
    <AppLayout title="Gigs Mtaani Command Center">
      <section className="panel feed-panel">
        <div className="feed-head">
          <h2>Live Gig Feed</h2>
          <div className="feed-controls">
            <button 
              className={feedMode === "MY_LOCATION" ? "active" : ""} 
              onClick={() => setFeedMode("MY_LOCATION")}
            >
              My Location
            </button>
            <button 
              className={feedMode === "GENERAL" ? "active" : ""} 
              onClick={() => setFeedMode("GENERAL")}
            >
              General
            </button>
          </div>
        </div>

        <div className="geo-strip">
          <span>
            {geo.loading ? "Locating..." : `Lat ${geo.latitude.toFixed(4)} · Lng ${geo.longitude.toFixed(4)}`}
          </span>
          <label>
            Radius {radiusMeters}m
            <input 
              type="range" 
              min={100} 
              max={50000} 
              step={100} 
              value={radiusMeters} 
              onChange={(e) => setRadiusMeters(Number(e.target.value))} 
            />
          </label>
        </div>

        {feedQuery.isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="spinner"></div>
          </div>
        ) : null}
        {feedQuery.isError ? <p className="error-text">Failed to load feed.</p> : null}

        <div className="gig-list">
          {(feedQuery.data?.gigs ?? []).map((gig: any) => (
            <GigCard 
              key={gig.id} 
              gig={gig} 
              onApply={(gigId) => applyMutation.mutate(gigId)} 
            />
          ))}
          {!feedQuery.data?.gigs?.length ? (
            <p className="text-muted text-center p-4">No gigs found in this filter.</p>
          ) : null}
        </div>
      </section>

      <NewGigForm
        latitude={geo.latitude}
        longitude={geo.longitude}
        onSubmit={async (payload) => {
          await createGigMutation.mutateAsync(payload);
        }}
      />

      <ChatPanel />

      <WalletPanel
        wallets={walletQuery.data?.wallets ?? []}
        onTopUp={async (amount) => {
          await topupMutation.mutateAsync(amount);
        }}
      />

      <SafetyPanel
        sessions={safetyQuery.data?.sessions ?? []}
        onSos={async (sessionId) => {
          await sosMutation.mutateAsync(sessionId);
        }}
      />

      <AdminPanel 
        metrics={adminMetricsQuery.data} 
        risk={riskDashboardQuery.data} 
      />
    </AppLayout>
  );
}
