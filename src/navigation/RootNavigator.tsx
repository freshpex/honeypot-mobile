import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthScreen } from "@/app/auth";
import { NotificationsScreen } from "@/app/notifications";
import { AppHeader } from "@/components";
import { useAuthStore } from "@/shared/state";
import { AdminTabs } from "./AdminTabs";
import { AppTabs } from "./AppTabs";

export type RootStackParamList = {
  Auth: undefined;
  Admin: undefined;
  Main: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  return (
    <Stack.Navigator
      screenOptions={{
        animation: "fade",
        contentStyle: { backgroundColor: "#FAF9F8" },
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen component={AuthScreen} name="Auth" />
      ) : role === "admin" ? (
        <Stack.Screen component={AdminTabs} name="Admin" />
      ) : (
        <Stack.Screen component={AppTabs} name="Main" />
      )}
      {isAuthenticated ? (
        <Stack.Screen
          component={NotificationsScreen}
          name="Notifications"
          options={{
            header: () => <AppHeader canGoBack title="Notifications" />,
            headerShown: true,
          }}
        />
      ) : null}
    </Stack.Navigator>
  );
};
