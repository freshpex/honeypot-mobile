import { apiClient } from "@/shared/api/client";
import type {
  AuthResponse,
  ConfirmResetPasswordPayload,
  GoogleAuthPayload,
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
    apiClient.post<{ message: string }, ResetPasswordPayload>("/auth/password/reset", payload),
  confirmPasswordReset: (payload: ConfirmResetPasswordPayload) =>
    apiClient.post<{ message: string }, ConfirmResetPasswordPayload>(
      "/auth/password/reset/confirm",
      payload,
    ),
  logout: (refreshToken?: string) =>
    apiClient.post<{ message: string }, { refreshToken?: string }>("/auth/logout", {
      refreshToken,
    }),
  continueWithGoogle: (payload: Pick<GoogleAuthPayload, "idToken">) =>
    apiClient.post<AuthResponse, GoogleAuthPayload>("/auth/social", {
      ...payload,
      provider: "google",
    }),
};

