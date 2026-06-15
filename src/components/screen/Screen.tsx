import { Text, View } from "react-native";

export type ScreenProps = {
  testID?: string;
};

export const Screen = ({ testID }: ScreenProps) => (
  <View testID={testID}>
    <Text>Screen</Text>
  </View>
);

