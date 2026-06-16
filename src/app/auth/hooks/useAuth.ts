import { useState } from "react";
import { useAuthStore } from "@/shared/state";
import { authService } from "../services";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../types";

const fallbackMessage =
  "We could not reach the auth service. Please try again when the API is available.";

export const useAuth = () => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const loginDemo = useAuthStore((state) => state.loginDemo);

  const run = async <TResult>(action: () => Promise<TResult>) => {
    setError(undefined);
    setIsLoading(true);
    try {
      return await action();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : fallbackMessage;
      setError(message || fallbackMessage);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    clearError: () => setError(undefined),
    continueWithGoogle: () => run(() => authService.continueWithGoogle()),
    login: async (payload: LoginPayload) => {
      setError(undefined);
      setIsLoading(true);
      const result = loginDemo(payload.email, payload.password);
      setIsLoading(false);
      if (!result.ok) {
        setError(result.message ?? fallbackMessage);
        return undefined;
      }
      return {
        accessToken: "demo-access-token",
        customerId: payload.email,
        message: "Demo login successful",
      };
    },
    register: (payload: RegisterPayload) => run(() => authService.register(payload)),
    requestPasswordReset: (payload: ResetPasswordPayload) =>
      run(() => authService.requestPasswordReset(payload)),
  };
};

