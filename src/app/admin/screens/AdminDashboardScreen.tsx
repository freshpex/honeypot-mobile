import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { useAdminStore, useCustomerStore, useSubscriptionStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet } from "@/shared/theme";
import {
  AdminCard,
  AdminMetricCard,
  AdminPill,
  AdminScreen,
  AdminSectionTitle,
} from "./AdminShared";

export const AdminDashboardScreen = () => {
  const users = useAdminStore((state) => state.users);
  const adminOrders = useAdminStore((state) => state.orders);
  const meals = useAdminStore((state) => state.meals);
  const customerOrders = useCustomerStore((state) => state.orders);
  const subscriptionStatus = useSubscriptionStore((state) => state.status);

  const allOrders = useMemo(
    () => [
      ...adminOrders.map((order) => ({
        status: order.status,
        total: parseNaira(order.total),
      })),
      ...customerOrders.map((order) => ({
        status: order.status,
        total: order.total,
      })),
    ],
    [adminOrders, customerOrders],
  );

  const overallStats = useMemo(
    () => ({
      activeOrders: allOrders.filter((order) =>
        ["Confirmed", "Preparing", "Out for Delivery"].includes(order.status),
      ).length,
      availableMeals: meals.filter((meal) => meal.status === "Available").length,
      deliveredOrders: allOrders.filter((order) => order.status === "Delivered").length,
      hiddenMeals: meals.filter((meal) => meal.status !== "Available").length,
      revenue: allOrders.reduce((sum, order) => sum + order.total, 0),
      suspendedUsers: users.filter((user) => user.status === "Suspended").length,
    }),
    [allOrders, meals, users],
  );

  const metrics = useMemo(
    () => [
      { icon: "people-outline", label: "Users", tone: "orange" as const, value: String(users.length) },
      {
        icon: "bag-handle-outline",
        label: "Orders",
        tone: "blue" as const,
        value: String(allOrders.length),
      },
      {
        icon: "cash-outline",
        label: "Revenue",
        tone: "green" as const,
        value: `₦${overallStats.revenue.toLocaleString()}`,
      },
      {
        icon: "restaurant-outline",
        label: "Meals",
        tone: "yellow" as const,
        value: String(meals.length),
      },
      {
        icon: "calendar-outline",
        label: "Plan State",
        tone: subscriptionStatus === "active" ? ("green" as const) : ("yellow" as const),
        value: subscriptionStatus,
      },
    ] satisfies {
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      tone: "orange" | "green" | "blue" | "yellow";
      value: string;
    }[],
    [allOrders.length, meals.length, overallStats.revenue, subscriptionStatus, users.length],
  );

  return (
    <AdminScreen>
      <AdminSectionTitle subtitle="Manage HoneyPot operations locally for now." title="Admin Overview" />
      <View style={styles.metrics}>
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} {...metric} />
        ))}
      </View>

      <AdminCard>
        <View style={styles.cardHeader}>
          <View style={styles.iconBubble}>
            <Ionicons color={resolveThemeColor("#FF4A17")} name="speedometer-outline" size={20} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.cardTitle}>Operations Health</Text>
            <Text style={styles.cardSubtitle}>Dummy admin data is ready for API integration.</Text>
          </View>
          <AdminPill label="Live UI" tone="green" />
        </View>
        {[
          `${overallStats.activeOrders} active orders need attention`,
          `${overallStats.deliveredOrders} delivered orders completed`,
          `${overallStats.availableMeals} meals available and ${overallStats.hiddenMeals} hidden or sold out`,
          `${overallStats.suspendedUsers} suspended users`,
          "Logs export prepares CSV locally",
        ].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Ionicons color={resolveThemeColor("#08A46B")} name="checkmark-circle" size={16} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </AdminCard>
    </AdminScreen>
  );
};

const parseNaira = (value: string) => Number(value.replace(/[^\d]/g, "")) || 0;

const styles = createThemedStyleSheet({
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  cardSubtitle: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 2,
  },
  cardTitle: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
  },
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingVertical: 6,
  },
  checkText: {
    color: "#4F4640",
    fontSize: 12,
    fontWeight: "700",
  },
  headerText: {
    flex: 1,
  },
  iconBubble: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
