import { create } from "zustand";
import { env } from "@/config";
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
  type StoredAuthSession,
} from "@/shared/storage";

export type AuthRole = "customer" | "staff" | "admin";

type AuthState = {
  accessToken?: string;
  email?: string;
  id?: string;
  isAuthenticated: boolean;
  isHydrated: boolean;
  name?: string;
  permissions: string[];
  refreshToken?: string;
  role?: AuthRole;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
  setSession: (session: StoredAuthSession) => Promise<void>;
};

const normalizeRole = (role: string): AuthRole => {
  if (role.toUpperCase() === "ADMIN") return "admin";
  if (role.toUpperCase() === "STAFF") return "staff";
  return "customer";
};

const applySession = (session: StoredAuthSession) => ({
  accessToken: session.accessToken,
  email: session.user.email,
  id: session.user.id,
  isAuthenticated: true,
  name: session.user.name,
  permissions: session.user.permissions ?? [],
  refreshToken: session.refreshToken,
  role: normalizeRole(session.user.role),
});

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isHydrated: false,
  permissions: [],
  hydrate: async () => {
    const session = await getAuthSession();
    if (session?.accessToken) {
      set({ ...applySession(session), isHydrated: true });
      return;
    }
    set({ isHydrated: true });
  },
  logout: async () => {
    const refreshToken = get().refreshToken;
    set({
      accessToken: undefined,
      email: undefined,
      id: undefined,
      isAuthenticated: false,
      name: undefined,
      permissions: [],
      refreshToken: undefined,
      role: undefined,
    });
    await clearAuthSession();

    try {
      await fetch(`${env.API_BASE_URL}/auth/logout`, {
        body: JSON.stringify({ refreshToken }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
    } catch {
      // Local logout should still complete if the API is temporarily unavailable.
    }
  },
  setSession: async (session) => {
    await saveAuthSession(session);
    set(applySession(session));
  },
}));
