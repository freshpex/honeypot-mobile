import { Text, View } from "react-native";

export type DeliveryStatusCardProps = {
  testID?: string;
};

export const DeliveryStatusCard = ({ testID }: DeliveryStatusCardProps) => (
  <View testID={testID}>
    <Text>DeliveryStatusCard</Text>
  </View>
);

