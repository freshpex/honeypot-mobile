import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { useAdminStore, useCustomerStore } from "@/shared/state";
import type { AdminOrder, AdminOrderStatus } from "@/shared/state";
import {
  AdminActionButton,
  AdminCard,
  AdminPill,
  AdminScreen,
  AdminSectionTitle,
} from "./AdminShared";

const statusFlow: AdminOrderStatus[] = [
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

type AdminVisibleOrder = AdminOrder & {
  source: "admin" | "customer";
};

export const AdminOrdersScreen = () => {
  const adminOrders = useAdminStore((state) => state.orders);
  const updateOrderStatus = useAdminStore((state) => state.updateOrderStatus);
  const customerOrders = useCustomerStore((state) => state.orders);
  const updateCustomerOrderStatus = useCustomerStore((state) => state.updateOrderStatus);

  const orders = useMemo<AdminVisibleOrder[]>(
    () => [
      ...customerOrders.map((order) => ({
        customer: "Enoch",
        date: order.date,
        id: order.id,
        items: order.items.map((item) => `${item.meal.name} x${item.quantity}`).join(", "),
        source: "customer" as const,
        status: order.status === "Confirmed" ? ("Confirmed" as const) : order.status,
        total: `₦${order.total.toLocaleString()}`,
      })),
      ...adminOrders.map((order) => ({ ...order, source: "admin" as const })),
    ],
    [adminOrders, customerOrders],
  );

  const pagination = usePagination(orders);

  const nextStatus = (status: AdminOrderStatus) => {
    const index = statusFlow.indexOf(status);
    return statusFlow[Math.min(index + 1, statusFlow.length - 1)];
  };

  return (
    <AdminScreen>
      <AdminSectionTitle subtitle="Update meal order progress and inspect checkout totals." title="Manage Orders" />
      {pagination.pageItems.map((order) => {
        const isDone = order.status === "Delivered" || order.status === "Cancelled";
        return (
          <AdminCard key={order.id}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.orderId}>{order.id}</Text>
                <Text style={styles.customer}>{order.customer} · {order.date}</Text>
              </View>
              <AdminPill
                label={order.status}
                tone={order.status === "Delivered" ? "green" : order.status === "Cancelled" ? "red" : "blue"}
              />
            </View>
            <Text style={styles.items}>{order.items}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.total}>{order.total}</Text>
              <AdminActionButton
                onPress={() => {
                  if (order.source === "customer") {
                    updateCustomerOrderStatus(order.id, "Delivered");
                    return;
                  }
                  updateOrderStatus(order.id, nextStatus(order.status));
                }}
                tone={isDone ? "green" : "orange"}
              >
                {isDone ? "Completed" : "Advance Status"}
              </AdminActionButton>
            </View>
          </AdminCard>
        );
      })}
      <PaginationControls
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        onNext={pagination.goNext}
        onPrevious={pagination.goPrevious}
        page={pagination.page}
        totalPages={pagination.totalPages}
      />
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  bottomRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  customer: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
  },
  items: {
    color: "#4F4640",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
  },
  orderId: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  topRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  total: {
    color: "#FF4A17",
    fontSize: 15,
    fontWeight: "900",
  },
});
