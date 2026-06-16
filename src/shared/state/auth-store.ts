import { create } from "zustand";

export type AuthRole = "customer" | "admin";

type DemoUser = {
  email: string;
  name: string;
  password: string;
  role: AuthRole;
};

export const demoUsers: DemoUser[] = [
  {
    email: "enoch@honeypot.app",
    name: "Enoch",
    password: "Password123",
    role: "customer",
  },
  {
    email: "admin@honeypot.app",
    name: "Admin",
    password: "Admin12345",
    role: "admin",
  },
];

type AuthState = {
  email?: string;
  isAuthenticated: boolean;
  name?: string;
  role?: AuthRole;
  loginDemo: (email: string, password: string) => { ok: boolean; message?: string };
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loginDemo: (email, password) => {
    const match = demoUsers.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
    );

    if (!match) {
      return {
        ok: false,
        message: "Use the prefilled demo credentials until the backend is connected.",
      };
    }

    set({
      email: match.email,
      isAuthenticated: true,
      name: match.name,
      role: match.role,
    });

    return { ok: true };
  },
  logout: () =>
    set({
      email: undefined,
      isAuthenticated: false,
      name: undefined,
      role: undefined,
    }),
}));
