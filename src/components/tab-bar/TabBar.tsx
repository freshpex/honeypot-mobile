import { Text, View } from "react-native";

export type TabBarProps = {
  testID?: string;
};

export const TabBar = ({ testID }: TabBarProps) => (
  <View testID={testID}>
    <Text>TabBar</Text>
  </View>
);

