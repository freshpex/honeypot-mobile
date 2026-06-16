import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "@/app/auth";
import { NotificationsScreen } from "@/app/notifications";
import { AppHeader } from "@/components";
import { AppTabs } from "./AppTabs";

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="Main"
    screenOptions={{
      animation: "fade",
      contentStyle: { backgroundColor: "#FAF9F8" },
      headerShown: false,
    }}
  >
    <Stack.Screen component={AppTabs} name="Main" />
    <Stack.Screen component={AuthScreen} name="Auth" />
    <Stack.Screen
      component={NotificationsScreen}
      name="Notifications"
      options={{
        header: () => <AppHeader canGoBack title="Notifications" />,
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);
