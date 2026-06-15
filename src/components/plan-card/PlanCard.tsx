import { Text, View } from "react-native";

export type PlanCardProps = {
  testID?: string;
};

export const PlanCard = ({ testID }: PlanCardProps) => (
  <View testID={testID}>
    <Text>PlanCard</Text>
  </View>
);

