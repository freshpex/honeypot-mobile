import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../types";
import { MyWalletScreen } from "./MyWalletScreen";
import { PaymentHistoryScreen } from "./PaymentHistoryScreen";
import { PaymentMethodsScreen } from "./PaymentMethodsScreen";
import { ProfileHomeScreen } from "./ProfileHomeScreen";
import { ReferralProgramScreen } from "./ReferralProgramScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileScreen = () => (
  <Stack.Navigator
    initialRouteName="ProfileHome"
    screenOptions={{
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#FAF9F8" },
      headerShown: false,
    }}
  >
    <Stack.Screen component={ProfileHomeScreen} name="ProfileHome" />
    <Stack.Screen component={PaymentMethodsScreen} name="PaymentMethods" />
    <Stack.Screen component={MyWalletScreen} name="MyWallet" />
    <Stack.Screen component={PaymentHistoryScreen} name="PaymentHistory" />
    <Stack.Screen component={ReferralProgramScreen} name="ReferralProgram" />
  </Stack.Navigator>
);
