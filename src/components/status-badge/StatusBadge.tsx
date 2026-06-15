import { Text, View } from "react-native";

export type StatusBadgeProps = {
  testID?: string;
};

export const StatusBadge = ({ testID }: StatusBadgeProps) => (
  <View testID={testID}>
    <Text>StatusBadge</Text>
  </View>
);

