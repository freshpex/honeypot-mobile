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
  email: string;
  password: string;
  confirmPassword: string;
};

export type ResetPasswordPayload = {
  email: string;
};

export type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  customerId?: string;
  message?: string;
};

