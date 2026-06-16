import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { resolveThemeColor } from "@/shared/theme";
import type { AuthStackParamList } from "../types";
import { LoginScreen } from "./LoginScreen";
import { RegisterScreen } from "./RegisterScreen";
import { ResetPasswordScreen } from "./ResetPasswordScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthScreen = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      animation: "fade",
      contentStyle: { backgroundColor: resolveThemeColor("#FAF9F8") },
      headerShown: false,
    }}
  >
    <Stack.Screen component={LoginScreen} name="Login" />
    <Stack.Screen component={RegisterScreen} name="Register" />
    <Stack.Screen component={ResetPasswordScreen} name="ResetPassword" />
  </Stack.Navigator>
);

