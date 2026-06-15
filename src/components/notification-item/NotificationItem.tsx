import { Text, View } from "react-native";

export type NotificationItemProps = {
  testID?: string;
};

export const NotificationItem = ({ testID }: NotificationItemProps) => (
  <View testID={testID}>
    <Text>NotificationItem</Text>
  </View>
);

