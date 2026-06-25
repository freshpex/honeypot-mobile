# HoneyPot Mobile

Expo React Native scaffold for the HoneyPot customer mobile app. This project is structured around product modules from the customer PRD, with local ownership for screens, components, tabs, modals, hooks, services, and tests.

## Stack

- Expo
- React Native
- TypeScript
- React Navigation
- TanStack Query
- Zustand
- React Hook Form
- Zod
- React Native StyleSheet
- Jest and React Native Testing Library

## Branches

- `main`: production branch
- `dev`: staging branch

## Getting Started

```bash
npm install
cp .env.example .env
npm run start
```

## Backend Auth

Set `EXPO_PUBLIC_API_BASE_URL` to the backend API prefix:

```text
EXPO_PUBLIC_API_BASE_URL=https://honeypot-backend-h5ja.onrender.com/api/v1
```

For local backend development, use `http://localhost:4000/api/v1` on iOS simulator or `http://10.0.2.2:4000/api/v1` on Android emulator. Auth screens call the backend for sign up, login, Google login, password reset request, and logout. Sessions are stored with Expo SecureStore.
# Google Sign-In

HoneyPot uses native `@react-native-google-signin/google-signin`, not browser-based
`expo-auth-session`. It requires a development, preview, or production native build
and does not work in Expo Go.

The OAuth clients must all belong to the same Google Cloud project:

- Android client: package `com.honeypot.mobile` plus the SHA-1 of every signing key
  used to distribute an APK/AAB.
- iOS client: bundle ID `com.honeypot.mobile`.
- Web client: passed to the native SDK to request an ID token and configured as an
  accepted audience by the HoneyPot backend.
- iOS URL scheme: the reversed iOS client ID.

EAS variables required in `development`, `preview`, and `production`:

```env
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
```

Inspect the SHA-1 of the exact APK being tested:

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\build-tools\36.1.0\apksigner.bat" verify --print-certs .\app.apk
```

After changing an OAuth client, URL scheme, or signing certificate, create and
install a new native build. An OTA update cannot change native Google Sign-In
configuration.
