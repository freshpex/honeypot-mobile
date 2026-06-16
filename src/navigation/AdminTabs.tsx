import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AdminDashboardScreen,
  AdminLogsScreen,
  AdminOrdersScreen,
  AdminSettingsScreen,
  AdminUsersScreen,
  type AdminTabParamList,
} from "@/app/admin";
import { AppHeader, TabBar } from "@/components";

const Tab = createBottomTabNavigator<AdminTabParamList>();

const adminTitles: Record<keyof AdminTabParamList, string> = {
  AdminOrders: "Manage Orders",
  Logs: "Logs",
  Overview: "Admin",
  Settings: "Settings",
  Users: "Users",
};

export const AdminTabs = () => (
  <Tab.Navigator
    initialRouteName="Overview"
    screenOptions={({ route }) => ({
      header: () => <AppHeader title={adminTitles[route.name]} />,
      headerShown: true,
    })}
    tabBar={(props) => <TabBar {...props} />}
  >
    <Tab.Screen component={AdminDashboardScreen} name="Overview" />
    <Tab.Screen component={AdminUsersScreen} name="Users" />
    <Tab.Screen
      component={AdminOrdersScreen}
      name="AdminOrders"
      options={{ title: "Orders" }}
    />
    <Tab.Screen component={AdminLogsScreen} name="Logs" />
    <Tab.Screen component={AdminSettingsScreen} name="Settings" />
  </Tab.Navigator>
);
