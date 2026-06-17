import * as SecureStore from "expo-secure-store";

export type StoredAuthSession = {
  accessToken: string;
  refreshToken?: string;
  user: {
    email: string;
    id: string;
    name: string;
    permissions?: string[];
    role: string;
  };
};

const AUTH_SESSION_KEY = "honeypot.auth.session";

export const saveAuthSession = async (session: StoredAuthSession) => {
  await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const getAuthSession = async () => {
  const raw = await SecureStore.getItemAsync(AUTH_SESSION_KEY);
  if (!raw) return undefined;
  return JSON.parse(raw) as StoredAuthSession;
};

export const clearAuthSession = async () => {
  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
};
