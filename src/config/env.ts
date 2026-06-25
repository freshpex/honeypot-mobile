export const env = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  GOOGLE_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  GOOGLE_IOS_URL_SCHEME: process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME,
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY,
  FLUTTERWAVE_PUBLIC_KEY: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
};

const googleClientIdPattern = /^\d+-[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/;

export const getGoogleOAuthConfigurationError = () => {
  if (!env.GOOGLE_WEB_CLIENT_ID || !googleClientIdPattern.test(env.GOOGLE_WEB_CLIENT_ID)) {
    return "The Google Web OAuth client ID is missing or invalid for this build.";
  }
  if (!env.GOOGLE_ANDROID_CLIENT_ID || !googleClientIdPattern.test(env.GOOGLE_ANDROID_CLIENT_ID)) {
    return "The Google Android OAuth client ID is missing or invalid for this build.";
  }
  if (!env.GOOGLE_IOS_CLIENT_ID || !googleClientIdPattern.test(env.GOOGLE_IOS_CLIENT_ID)) {
    return "The Google iOS OAuth client ID is missing or invalid for this build.";
  }
  const expectedIosScheme = `com.googleusercontent.apps.${env.GOOGLE_IOS_CLIENT_ID.replace(
    ".apps.googleusercontent.com",
    "",
  )}`;
  if (env.GOOGLE_IOS_URL_SCHEME !== expectedIosScheme) {
    return "The Google iOS URL scheme does not match the configured iOS OAuth client ID.";
  }
  return undefined;
};
