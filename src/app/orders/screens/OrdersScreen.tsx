import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { formatNaira, useCustomerStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";

export const OrdersScreen = () => {
  const tabs = useMemo(() => ["Active", "Delivered", "Cancelled"], []);
  const orders = useCustomerStore((state) => state.orders);
  const [activeTab, setActiveTab] = useState("Active");
  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (activeTab === "Active") {
          return ["Confirmed", "Preparing", "Out for Delivery"].includes(order.status);
        }
        if (activeTab === "Delivered") return order.status === "Delivered";
        return order.status === "Cancelled";
      }),
    [activeTab, orders],
  );
  const orderRows = useMemo(
    () =>
      visibleOrders.length
        ? visibleOrders.map((order) => ({
            date: order.date,
            id: order.id,
            meal: `${order.items[0]?.meal.name ?? "HoneyPot meal"} x${order.items[0]?.quantity ?? 1}`,
            status: order.status,
            total: formatNaira(order.total),
            type: order.type,
          }))
        : activeTab === "Active"
          ? [
              {
                date: "Jun 16, 2026",
                id: "#HP-MQGX3ZJL",
                meal: "Avocado Toast & Eggs x1",
                status: "Confirmed",
                total: "₦4,300",
                type: "One Off",
              },
            ]
          : [],
    [activeTab, visibleOrders],
  );
  const orderPagination = usePagination(orderRows);

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.segment}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.segmentItem, isActive && styles.activeSegmentItem]}
              >
                <Text style={[styles.segmentText, isActive && styles.activeSegmentText]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {orderRows.length ? (
          <View style={styles.orderList}>
            {orderPagination.pageItems.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={styles.statusPill}>
                    <Ionicons color={resolveThemeColor("#4E7CFF")} name="checkmark-circle-outline" size={10} />
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderMeal}>{order.meal}</Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderType}>{order.type}</Text>
                  <Text style={styles.orderTotal}>{order.total}</Text>
                </View>
              </View>
            ))}
            <PaginationControls
              canGoNext={orderPagination.canGoNext}
              canGoPrevious={orderPagination.canGoPrevious}
              onNext={orderPagination.goNext}
              onPrevious={orderPagination.goPrevious}
              page={orderPagination.page}
              totalPages={orderPagination.totalPages}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons color={resolveThemeColor("#C9C5C1")} name="cube-outline" size={32} />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = createThemedStyleSheet({
  activeSegmentItem: {
    backgroundColor: "#FFFFFF",
    elevation: 3,
    ...skeuo.pressed,
  },
  activeSegmentText: {
    color: "#171513",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 27,
    paddingTop: 10,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 120,
  },
  emptyText: {
    color: "#8B8580",
    fontSize: 13,
    marginTop: 9,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 4,
    padding: 13,
    ...skeuo.card,
  },
  orderDate: {
    color: "#8B8580",
    fontSize: 9,
    marginTop: 3,
  },
  orderFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  orderHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  orderList: {
    marginTop: 18,
  },
  orderMeal: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 12,
  },
  orderTotal: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  orderType: {
    color: "#817B75",
    fontSize: 10,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  segment: {
    backgroundColor: "#F1EFED",
    borderRadius: 8,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 2,
    flexDirection: "row",
    height: 22,
    marginTop: 18,
    padding: 1,
    ...skeuo.pressed,
  },
  segmentItem: {
    alignItems: "center",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
  },
  segmentText: {
    color: "#77716B",
    fontSize: 10,
    fontWeight: "600",
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: "#EDF1FF",
    borderRadius: 10,
    flexDirection: "row",
    gap: 3,
    height: 18,
    paddingHorizontal: 8,
  },
  statusText: {
    color: "#4E7CFF",
    fontSize: 8,
    fontWeight: "900",
  },
  subtitle: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 3,
  },
  title: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "800",
  },
});
