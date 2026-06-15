import { Text, View } from "react-native";

export type ModalShellProps = {
  testID?: string;
};

export const ModalShell = ({ testID }: ModalShellProps) => (
  <View testID={testID}>
    <Text>ModalShell</Text>
  </View>
);

