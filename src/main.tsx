import { Text, View } from "react-native";
import { QueryProvider } from "./providers/query-provider";

export default function Main() {
  return (
    <QueryProvider>
      <View>
        <Text>HoneyPot mobile scaffold</Text>
      </View>
    </QueryProvider>
  );
}
