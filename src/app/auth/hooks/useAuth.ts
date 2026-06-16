import { useState } from "react";
import { authService } from "../services";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../types";

const fallbackMessage =
  "We could not reach the auth service. Please try again when the API is available.";

export const useAuth = () => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

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
    login: (payload: LoginPayload) => run(() => authService.login(payload)),
    register: (payload: RegisterPayload) => run(() => authService.register(payload)),
    requestPasswordReset: (payload: ResetPasswordPayload) =>
      run(() => authService.requestPasswordReset(payload)),
  };
};

