import { Text, View } from "react-native";

export type FormFieldProps = {
  testID?: string;
};

export const FormField = ({ testID }: FormFieldProps) => (
  <View testID={testID}>
    <Text>FormField</Text>
  </View>
);

