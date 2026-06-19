export type AuthModuleName = "auth";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPassword: undefined;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordPayload = {
  email: string;
};

export type ConfirmResetPasswordPayload = {
  confirmPassword: string;
  password: string;
  token: string;
};

export type GoogleAuthPayload = {
  idToken: string;
  provider: "google";
};

export type AuthResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    email: string;
    id: string;
    name: string;
    permissions?: string[];
    role: "CUSTOMER" | "STAFF" | "ADMIN";
  };
  message?: string;
};

