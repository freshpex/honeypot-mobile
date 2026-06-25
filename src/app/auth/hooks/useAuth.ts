import { useState } from "react";
import { Platform } from "react-native";
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { env, getGoogleOAuthConfigurationError } from "@/config";
import { useAuthStore } from "@/shared/state";
import { authService } from "../services";
import type { LoginPayload, RegisterPayload, ResetPasswordPayload } from "../types";

const fallbackMessage =
  "We could not reach the auth service. Please try again when the API is available.";

GoogleSignin.configure({
  iosClientId: env.GOOGLE_IOS_CLIENT_ID,
  webClientId: env.GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
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
      run(async () => {
        const configurationError = getGoogleOAuthConfigurationError();
        if (configurationError) throw new GoogleOAuthConfigurationError(configurationError);
        if (Platform.OS === "android") {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }
        const result = await GoogleSignin.signIn();
        if (isCancelledResponse(result)) return undefined;
        if (!isSuccessResponse(result) || !result.data.idToken) {
          throw new Error("Google did not return a secure ID token.");
        }
        const response = await authService.continueWithGoogle({ idToken: result.data.idToken });
        await setSession(response);
        return response;
      }),
    login: (payload: LoginPayload) => authenticate(() => authService.login(payload)),
    register: (payload: RegisterPayload) => authenticate(() => authService.register(payload)),
    requestPasswordReset: (payload: ResetPasswordPayload) =>
      run(() => authService.requestPasswordReset(payload)),
  };
};

export const googleAuthErrorMessage = (caughtError: unknown) => {
  if (caughtError instanceof GoogleOAuthConfigurationError) return caughtError.message;
  if (isErrorWithCode(caughtError)) {
    const code = String(caughtError.code);
    if (code === statusCodes.SIGN_IN_CANCELLED) return "Google sign-in was cancelled.";
    if (code === statusCodes.IN_PROGRESS) return "Google sign-in is already in progress.";
    if (code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return "Google Play Services is unavailable or needs an update.";
    }
    if (code === "DEVELOPER_ERROR" || code === "10") {
      return Platform.OS === "android"
        ? "Google rejected this Android build signature. Register the exact SHA-1 of the installed APK for package com.honeypot.mobile, then create a new native build."
        : "Google rejected this iOS app configuration. Confirm bundle ID com.honeypot.mobile and its reversed iOS client URL scheme, then create a new native build.";
    }
    return `Google sign-in failed (${code}). Please try again or contact support.`;
  }
  if (caughtError instanceof Error && /DEVELOPER_ERROR|troubleshooting/i.test(caughtError.message)) {
    return "Google rejected this native app configuration. Install a newly rebuilt app after verifying its exact package, signing SHA-1, client IDs, and iOS URL scheme.";
  }
  return caughtError instanceof Error ? caughtError.message : fallbackMessage;
};

class GoogleOAuthConfigurationError extends Error {}
