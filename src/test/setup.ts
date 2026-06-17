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

