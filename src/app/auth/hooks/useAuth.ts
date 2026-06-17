import { useState } from "react";
import { useAuthStore } from "@/shared/state";
import { authService } from "../services";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../types";

const fallbackMessage =
  "We could not reach the auth service. Please try again when the API is available.";

export const useAuth = () => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);

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

  const authenticate = (action: () => Promise<Awaited<ReturnType<typeof authService.login>>>) =>
    run(async () => {
      const response = await action();
      await setSession(response);
      return response;
    });

  return {
    error,
    isLoading,
    clearError: () => setError(undefined),
    continueWithGoogle: () => authenticate(() => authService.continueWithGoogle()),
    login: (payload: LoginPayload) => authenticate(() => authService.login(payload)),
    register: (payload: RegisterPayload) => authenticate(() => authService.register(payload)),
    requestPasswordReset: (payload: ResetPasswordPayload) =>
      run(() => authService.requestPasswordReset(payload)),
  };
};
