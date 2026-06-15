import { Text, View } from "react-native";

export type EmptyStateProps = {
  testID?: string;
};

export const EmptyState = ({ testID }: EmptyStateProps) => (
  <View testID={testID}>
    <Text>EmptyState</Text>
  </View>
);

