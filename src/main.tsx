import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./navigation/RootNavigator";
import { QueryProvider } from "./providers/query-provider";
import { useAppearanceStore } from "./shared/state";

export default function Main() {
  const mode = useAppearanceStore((state) => state.mode);

  return (
    <GestureHandlerRootView key={mode} style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <NavigationContainer theme={mode === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style={mode === "dark" ? "light" : "dark"} />
            <RootNavigator />
          </NavigationContainer>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
