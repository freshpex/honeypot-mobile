import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppHeader } from "@/components";
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
      header: ({ route }) => (
        <AppHeader
          canGoBack={route.name !== "Menu"}
          title={mealTitles[route.name as keyof MealsStackParamList]}
        />
      ),
      headerShown: true,
    }}
  >
    <Stack.Screen component={MenuScreen} name="Menu" />
    <Stack.Screen component={CartScreen} name="Cart" />
    <Stack.Screen component={CheckoutScreen} name="Checkout" />
  </Stack.Navigator>
);

const mealTitles: Record<keyof MealsStackParamList, string> = {
  Cart: "Cart",
  Checkout: "Checkout",
  Menu: "Menu",
};
