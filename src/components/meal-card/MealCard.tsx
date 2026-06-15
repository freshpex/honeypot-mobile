import { Text, View } from "react-native";

export type MealCardProps = {
  testID?: string;
};

export const MealCard = ({ testID }: MealCardProps) => (
  <View testID={testID}>
    <Text>MealCard</Text>
  </View>
);

