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
EXPO_PUBLIC_API_BASE_URL=https://honeypot-backend.fly.dev/api/v1
```

For local backend development, use `http://localhost:4000/api/v1` on iOS simulator or `http://10.0.2.2:4000/api/v1` on Android emulator. Auth screens call the backend for sign up, login, Google login, password reset request, and logout. Sessions are stored with Expo SecureStore.
