import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MealsStackParamList } from "../types";
import { CartScreen } from "./CartScreen";
import { CheckoutScreen } from "./CheckoutScreen";
import { MenuScreen } from "./MenuScreen";

const Stack = createNativeStackNavigator<MealsStackParamList>();

export const MealsScreen = () => (
  <Stack.Navigator
    initialRouteName="Menu"
    screenOptions={{
      animation: "slide_from_right",
      contentStyle: { backgroundColor: "#FAF9F8" },
      headerShown: false,
    }}
  >
    <Stack.Screen component={MenuScreen} name="Menu" />
    <Stack.Screen component={CartScreen} name="Cart" />
    <Stack.Screen component={CheckoutScreen} name="Checkout" />
  </Stack.Navigator>
);
