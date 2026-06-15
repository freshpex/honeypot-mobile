import { Text, View } from "react-native";

export type PaymentMethodCardProps = {
  testID?: string;
};

export const PaymentMethodCard = ({ testID }: PaymentMethodCardProps) => (
  <View testID={testID}>
    <Text>PaymentMethodCard</Text>
  </View>
);

