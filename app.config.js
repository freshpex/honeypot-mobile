const app = require("./app.json");

const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const googleIosUrlScheme =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME ||
  (googleIosClientId && googleIosClientId.endsWith(".apps.googleusercontent.com")
    ? `com.googleusercontent.apps.${googleIosClientId.replace(".apps.googleusercontent.com", "")}`
    : undefined);

const googleSignInPlugin = googleIosUrlScheme
  ? ["@react-native-google-signin/google-signin", { iosUrlScheme: googleIosUrlScheme }]
  : "@react-native-google-signin/google-signin";

module.exports = ({ config }) => ({
  ...config,
  ...app.expo,
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
    googleSignInPlugin,
  ],
});
