import { useState } from "react";
import { Platform } from "react-native";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { env } from "@/config";
import { useAuthStore } from "@/shared/state";
import { authService } from "../services";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../types";

const fallbackMessage =
  "We could not reach the auth service. Please try again when the API is available.";

GoogleSignin.configure({
  iosClientId: env.GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
  webClientId: env.GOOGLE_WEB_CLIENT_ID,
});

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
      const message = googleAuthErrorMessage(caughtError);
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
        if (!env.GOOGLE_WEB_CLIENT_ID) {
          throw new Error("Google sign-in is missing the Web client ID.");
        }
        if (Platform.OS === "android" && !env.GOOGLE_ANDROID_CLIENT_ID) {
          throw new Error("Google sign-in is missing the Android client ID.");
        }
        if (Platform.OS === "ios" && !env.GOOGLE_IOS_CLIENT_ID) {
          throw new Error("Google sign-in is missing the iOS client ID.");
        }
        if (Platform.OS === "android") {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }
        const result = await GoogleSignin.signIn();
        if (result.type === "cancelled") {
          throw new Error("Google sign-in was cancelled.");
        }
        if (!result.data.idToken) {
          throw new Error("Google did not return a secure ID token.");
        }
        return authService.continueWithGoogle({ idToken: result.data.idToken });
      }),
    login: (payload: LoginPayload) => authenticate(() => authService.login(payload)),
    register: (payload: RegisterPayload) => authenticate(() => authService.register(payload)),
    requestPasswordReset: (payload: ResetPasswordPayload) =>
      run(() => authService.requestPasswordReset(payload)),
  };
};

export const googleAuthErrorMessage = (caughtError: unknown) => {
  if (caughtError instanceof Error && "code" in caughtError) {
    const code = String((caughtError as { code?: string }).code);
    if (code === statusCodes.SIGN_IN_CANCELLED) return "Google sign-in was cancelled.";
    if (code === statusCodes.IN_PROGRESS) return "Google sign-in is already in progress.";
    if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return "Google Play Services is unavailable or needs an update.";
    }
  }
  return caughtError instanceof Error ? caughtError.message : fallbackMessage;
};
