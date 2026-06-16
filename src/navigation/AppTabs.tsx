import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabBar } from "@/components";
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
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <TabBar {...props} />}
  >
    <Tab.Screen component={DashboardScreen} name="Home" />
    <Tab.Screen component={MealsScreen} name="Meals" />
    <Tab.Screen component={OrdersScreen} name="Orders" />
    <Tab.Screen component={SubscriptionsScreen} name="Plan" />
    <Tab.Screen component={ProfileScreen} name="Profile" />
  </Tab.Navigator>
);
