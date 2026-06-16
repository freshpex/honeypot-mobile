import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppHeader, TabBar } from "@/components";
import { DashboardScreen } from "@/app/dashboard";
import { MealsScreen } from "@/app/meals";
import { OrdersScreen } from "@/app/orders";
import { ProfileScreen } from "@/app/profile";
import { SubscriptionsScreen } from "@/app/subscriptions";

export type AppTabParamList = {
  Home: undefined;
  Meals: undefined;
  Orders: undefined;
  Plan: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

export const AppTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      header: () => <AppHeader title={tabTitles[route.name]} />,
      headerShown: true,
    })}
    tabBar={(props) => <TabBar {...props} />}
  >
    <Tab.Screen component={DashboardScreen} name="Home" />
    <Tab.Screen component={MealsScreen} name="Meals" options={{ headerShown: false }} />
    <Tab.Screen component={OrdersScreen} name="Orders" />
    <Tab.Screen component={SubscriptionsScreen} name="Plan" />
    <Tab.Screen component={ProfileScreen} name="Profile" options={{ headerShown: false }} />
  </Tab.Navigator>
);

const tabTitles: Record<keyof AppTabParamList, string> = {
  Home: "Home",
  Meals: "Menu",
  Orders: "Orders",
  Plan: "Subscription",
  Profile: "Profile",
};
