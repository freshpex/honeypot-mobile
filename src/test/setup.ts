/* eslint-disable @typescript-eslint/no-require-imports */

jest.mock("react-native-maps", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockMap = ({ children, ...props }: { children?: React.ReactNode }) =>
    React.createElement(View, props, children);
  const MockLayer = (props: Record<string, unknown>) => React.createElement(View, props);

  return {
    __esModule: true,
    default: MockMap,
    Marker: MockLayer,
    Polyline: MockLayer,
    UrlTile: MockLayer,
  };
});

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn().mockResolvedValue(true),
    signIn: jest.fn().mockResolvedValue({
      data: { idToken: "test-google-id-token" },
      type: "success",
    }),
    signOut: jest.fn().mockResolvedValue(null),
  },
  statusCodes: {
    IN_PROGRESS: "IN_PROGRESS",
    PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
    SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  },
}));

