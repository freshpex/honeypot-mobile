require("@expo/env").load(process.cwd());

const app = require("./app.json");

const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleIosUrlScheme =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME ||
  (googleIosClientId && googleIosClientId.endsWith(".apps.googleusercontent.com")
    ? `com.googleusercontent.apps.${googleIosClientId.replace(".apps.googleusercontent.com", "")}`
    : undefined);

const requiredGoogleValues = {
  EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: googleAndroidClientId,
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: googleIosClientId,
  EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME: googleIosUrlScheme,
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: googleWebClientId,
};
const missingGoogleValues = Object.entries(requiredGoogleValues)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingGoogleValues.length) {
  throw new Error(
    `Google Sign-In build configuration is incomplete. Missing: ${missingGoogleValues.join(", ")}`,
  );
}

const expectedIosUrlScheme = `com.googleusercontent.apps.${googleIosClientId.replace(
  ".apps.googleusercontent.com",
  "",
)}`;

if (googleIosUrlScheme !== expectedIosUrlScheme) {
  throw new Error(
    "EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME must be the reversed EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID.",
  );
}

module.exports = ({ config }) => ({
  ...config,
  ...app.expo,
  ios: {
    ...app.expo.ios,
    infoPlist: {
      ...app.expo.ios.infoPlist,
      GIDClientID: googleIosClientId,
      GIDServerClientID: googleWebClientId,
    },
  },
  extra: {
    ...app.expo.extra,
    googleOAuth: {
      androidClientIdConfigured: Boolean(googleAndroidClientId),
      iosClientIdConfigured: Boolean(googleIosClientId),
      webClientIdConfigured: Boolean(googleWebClientId),
    },
  },
  plugins: [
    "expo-font",
    "expo-secure-store",
    "expo-notifications",
    [
      "expo-build-properties",
      {
        ios: {
          extraPods: [
            { name: "AppCheckCore", modular_headers: true },
            { name: "GoogleUtilities", modular_headers: true },
            { name: "RecaptchaInterop", modular_headers: true },
          ],
        },
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./public/playstore-icon.png",
        resizeMode: "contain",
        backgroundColor: "#FAF9F8",
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      { iosUrlScheme: googleIosUrlScheme },
    ],
  ],
});
