import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppTabs } from "./navigation/AppTabs";
import { QueryProvider } from "./providers/query-provider";

export default function Main() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppTabs />
          </NavigationContainer>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
