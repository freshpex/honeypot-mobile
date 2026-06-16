import { apiClient } from "@/shared/api/client";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types";

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse, LoginPayload>("/auth/login", payload),
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse, RegisterPayload>("/auth/register", payload),
  requestPasswordReset: (payload: ResetPasswordPayload) =>
    apiClient.post<AuthResponse, ResetPasswordPayload>("/auth/password/reset", payload),
  continueWithGoogle: () =>
    apiClient.post<AuthResponse, { provider: "google" }>("/auth/social", {
      provider: "google",
    }),
};

