// Demo mode - Simulates backend responses for testing UI without a real backend

import type { SessionUser } from "../state/authStore";

const DEMO_USERS = {
  admin: {
    id: "demo-admin-001",
    campusEmail: "admin@gigsmtaani.university",
    phoneE164: "+254700000001",
    role: "ADMIN",
    status: "ACTIVE",
    displayName: "Platform Admin",
    campusId: "GLOBAL",
    profile: {
      displayName: "Platform Admin",
      campusId: "GLOBAL",
      skills: ["moderation", "ops"],
      ratingAvg: 4.9,
      ratingCount: 156
    },
    trustScore: {
      score: 95,
      band: "A" as const
    }
  },
  worker: {
    id: "demo-worker-001",
    campusEmail: "comrade1@campus.ac.ke",
    phoneE164: "+254700000002",
    role: "VERIFIED_STUDENT",
    status: "ACTIVE",
    displayName: "Comrade One",
    campusId: "MAIN_CAMPUS",
    profile: {
      displayName: "Comrade One",
      campusId: "MAIN_CAMPUS",
      skills: ["delivery", "cleaning", "design"],
      ratingAvg: 4.7,
      ratingCount: 42
    },
    trustScore: {
      score: 78,
      band: "B" as const
    }
  }
};

const DEMO_GIGS = [
  {
    id: "gig-001",
    title: "Need two people to move hostel furniture",
    description: "Move beds and desks within 2 hostel blocks. Gloves provided. Starts in 2 hours.",
    category: "Moving",
    payAmount: 1200,
    currency: "KES",
    latitude: -1.2824,
    longitude: 36.8202,
    radiusMeters: 3000,
    status: "OPEN",
    startsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    poster: DEMO_USERS.admin,
    applicationsCount: 3,
    distance: "1.2 km"
  },
  {
    id: "gig-002",
    title: "Quick assignment typing and formatting",
    description: "Format a 20-page document in APA style tonight. Must know Word styles.",
    category: "Academic",
    payAmount: 700,
    currency: "KES",
    latitude: -1.2799,
    longitude: 36.8172,
    radiusMeters: 5000,
    status: "OPEN",
    startsAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    poster: DEMO_USERS.worker,
    applicationsCount: 1,
    distance: "0.5 km"
  },
  {
    id: "gig-003",
    title: "Campus food delivery - 10 orders",
    description: "Pick up food from mess hall and deliver to various hostel blocks. Bike preferred.",
    category: "Delivery",
    payAmount: 500,
    currency: "KES",
    latitude: -1.2810,
    longitude: 36.8190,
    radiusMeters: 2000,
    status: "OPEN",
    startsAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    poster: DEMO_USERS.worker,
    applicationsCount: 5,
    distance: "0.8 km"
  },
  {
    id: "gig-004",
    title: "Library book organization help",
    description: "Help organize returned books in the main library. 3 hours shift.",
    category: "Organizing",
    payAmount: 400,
    currency: "KES",
    latitude: -1.2835,
    longitude: 36.8210,
    radiusMeters: 4000,
    status: "OPEN",
    startsAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    poster: DEMO_USERS.admin,
    applicationsCount: 2,
    distance: "2.1 km"
  },
  {
    id: "gig-005",
    title: "Event photography for campus club",
    description: "Take photos at tonight's cultural event. Own camera required.",
    category: "Photography",
    payAmount: 1500,
    currency: "KES",
    latitude: -1.2800,
    longitude: 36.8160,
    radiusMeters: 6000,
    status: "OPEN",
    startsAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    poster: DEMO_USERS.worker,
    applicationsCount: 0,
    distance: "1.5 km"
  }
];

const DEMO_THREADS = [
  {
    id: "thread-001",
    otherUser: DEMO_USERS.worker,
    lastMessage: "Sure, I can help with that!",
    lastMessageAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    unreadCount: 2
  },
  {
    id: "thread-002",
    otherUser: DEMO_USERS.admin,
    lastMessage: "Your application has been accepted",
    lastMessageAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 0
  }
];

const DEMO_WALLET = {
  available: 2500,
  pending: 500,
  currency: "KES",
  transactions: [
    { id: "tx-001", type: "credit", amount: 1200, description: "Gig completed: Furniture moving", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "tx-002", type: "debit", amount: 200, description: "Platform fee", createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: "tx-003", type: "credit", amount: 700, description: "Gig completed: Document typing", createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
  ]
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const demoApi = {
  isDemoMode: true,

  login: async (credentials: { identifier: string; password: string }) => {
    await delay(800);
    
    // Accept any credentials for demo
    const isAdmin = credentials.identifier.toLowerCase().includes("admin");
    const user = isAdmin ? DEMO_USERS.admin : DEMO_USERS.worker;
    
    return {
      accessToken: "demo-access-token-" + Date.now(),
      refreshToken: "demo-refresh-token-" + Date.now(),
      user
    };
  },

  register: async (data: { campusEmail: string; phone: string; password: string; displayName: string; campusId: string }) => {
    await delay(1000);
    // Demo always succeeds
    return { success: true };
  },

  gigs: {
    feed: async () => {
      await delay(500);
      return DEMO_GIGS;
    },
    myPosted: async () => {
      await delay(300);
      return DEMO_GIGS.slice(0, 2);
    },
    apply: async (gigId: string) => {
      await delay(400);
      return { success: true, gigId };
    }
  },

  chat: {
    threads: async () => {
      await delay(300);
      return DEMO_THREADS;
    },
    messages: async (threadId: string) => {
      await delay(200);
      return [
        { id: "msg-1", senderId: "other", content: "Hi! Are you available for the gig?", createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
        { id: "msg-2", senderId: "me", content: "Yes, I am! When do you need me?", createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
        { id: "msg-3", senderId: "other", content: "Great! Can you start in 2 hours?", createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        { id: "msg-4", senderId: "me", content: "Sure, I can help with that!", createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() }
      ];
    }
  },

  wallet: {
    me: async () => {
      await delay(300);
      return DEMO_WALLET;
    }
  }
};

// Check if demo mode should be used
export function isDemoMode(): boolean {
  return localStorage.getItem("gigs-demo-mode") === "true" || 
         localStorage.getItem("gigs-mtaani-auth") === undefined;
}
