import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SupportScreen } from "@/app/support";
import { AppHeader } from "@/components";
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
      header: ({ route }) => (
        <AppHeader
          canGoBack={route.name !== "ProfileHome"}
          title={profileTitles[route.name as keyof ProfileStackParamList]}
        />
      ),
      headerShown: true,
    }}
  >
    <Stack.Screen component={ProfileHomeScreen} name="ProfileHome" />
    <Stack.Screen component={PaymentMethodsScreen} name="PaymentMethods" />
    <Stack.Screen component={MyWalletScreen} name="MyWallet" />
    <Stack.Screen component={PaymentHistoryScreen} name="PaymentHistory" />
    <Stack.Screen component={ReferralProgramScreen} name="ReferralProgram" />
    <Stack.Screen component={SupportScreen} name="Support" />
  </Stack.Navigator>
);

const profileTitles: Record<keyof ProfileStackParamList, string> = {
  MyWallet: "My Wallet",
  PaymentHistory: "Payment History",
  PaymentMethods: "Payment Methods",
  ProfileHome: "Profile",
  ReferralProgram: "Referral Program",
  Support: "Support",
};
