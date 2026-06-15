import { Text, View } from "react-native";

export type ButtonProps = {
  testID?: string;
};

export const Button = ({ testID }: ButtonProps) => (
  <View testID={testID}>
    <Text>Button</Text>
  </View>
);

