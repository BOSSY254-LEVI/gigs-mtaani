import { create } from "zustand";
import { persist } from "zustand/middleware";

type Profile = {
  displayName: string;
  campusId: string;
  avatarUrl?: string;
  bio?: string;
  skills?: string[];
  ratingAvg?: number;
  ratingCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type TrustScore = {
  score: number;
  band: "A" | "B" | "C" | "RESTRICTED";
};

export type SessionUser = {
  id: string;
  campusEmail: string;
  phoneE164?: string;
  role: string;
  status?: string;
  displayName?: string;
  campusId?: string;
  profile?: Profile;
  trustScore?: TrustScore;
  emailConfirmed?: boolean;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: SessionUser | null;
  setSession: (payload: { accessToken: string; refreshToken: string; user: SessionUser }) => void;
  setUser: (user: SessionUser | null) => void;
  updateAccessToken: (accessToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) => {
        set({ accessToken, refreshToken, user });
      },
      setUser: (user) => set({ user }),
      updateAccessToken: (accessToken) => set((state) => ({ ...state, accessToken })),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null })
    }),
    {
      name: "gigs-mtaani-auth"
    }
  )
);

export function getAuthSnapshot() {
  return useAuthStore.getState();
}

