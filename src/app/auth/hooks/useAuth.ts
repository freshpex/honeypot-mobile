import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useState } from "react";
import { env } from "@/config";
import { useAuthStore } from "@/shared/state";
import { authService } from "../services";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../types";

WebBrowser.maybeCompleteAuthSession();

const fallbackMessage =
  "We could not reach the auth service. Please try again when the API is available.";

export const useAuth = () => {
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const [googleRequest, , promptGoogleAsync] = Google.useIdTokenAuthRequest({
    androidClientId: env.GOOGLE_ANDROID_CLIENT_ID,
    clientId: env.GOOGLE_EXPO_CLIENT_ID || env.GOOGLE_WEB_CLIENT_ID,
    iosClientId: env.GOOGLE_IOS_CLIENT_ID,
    webClientId: env.GOOGLE_WEB_CLIENT_ID,
  });

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
    continueWithGoogle: () =>
      authenticate(async () => {
        if (!googleRequest) {
          throw new Error("Google sign-in is not configured on this device.");
        }
        const result = await promptGoogleAsync();
        if (result.type !== "success" || !result.params.id_token) {
          throw new Error("Google sign-in was cancelled or did not return an ID token.");
        }
        return authService.continueWithGoogle({ idToken: result.params.id_token });
      }),
    login: (payload: LoginPayload) => authenticate(() => authService.login(payload)),
    register: (payload: RegisterPayload) => authenticate(() => authService.register(payload)),
    requestPasswordReset: (payload: ResetPasswordPayload) =>
      run(() => authService.requestPasswordReset(payload)),
  };
};
