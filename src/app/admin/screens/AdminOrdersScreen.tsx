import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { ADMIN_PAGE_SIZE, useAdminStore, useCustomerStore } from "@/shared/state";
import type { AdminOrder, AdminOrderStatus } from "@/shared/state";
import { createThemedStyleSheet } from "@/shared/theme";
import {
  AdminCard,
  AdminPill,
  AdminScreen,
  AdminSectionTitle,
} from "./AdminShared";

const orderStatuses: AdminOrderStatus[] = [
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
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
        status: order.status,
        total: `₦${order.total.toLocaleString()}`,
      })),
      ...adminOrders.map((order) => ({ ...order, source: "admin" as const })),
    ],
    [adminOrders, customerOrders],
  );

  const pagination = usePagination(orders, ADMIN_PAGE_SIZE);

  return (
    <AdminScreen>
      <AdminSectionTitle subtitle="Update meal order progress and inspect checkout totals." title="Manage Orders" />
      {pagination.pageItems.map((order) => (
        <AdminCard key={order.id}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.customer}>{order.customer} · {order.date}</Text>
            </View>
            <AdminPill label={order.status} tone={statusTone(order.status)} />
          </View>
          <Text style={styles.items}>{order.items}</Text>
          <View style={styles.statusRow}>
            {orderStatuses.map((status) => {
              const active = order.status === status;
              return (
                <Pressable
                  key={status}
                  onPress={() => {
                  if (order.source === "customer") {
                      updateCustomerOrderStatus(order.id, status);
                    return;
                  }
                    updateOrderStatus(order.id, status);
                }}
                  style={[styles.statusChip, active && styles.statusChipActive]}
                >
                  <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                    {status}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.total}>{order.total}</Text>
            <Text style={styles.source}>{order.source === "customer" ? "Customer checkout" : "Admin seed order"}</Text>
          </View>
        </AdminCard>
      ))}
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

const statusTone = (status: AdminOrderStatus) => {
  if (status === "Delivered") return "green";
  if (status === "Cancelled") return "red";
  if (status === "Confirmed") return "orange";
  return "blue";
};

const styles = createThemedStyleSheet({
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
  source: {
    color: "#817B75",
    fontSize: 11,
    fontWeight: "800",
  },
  statusChip: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 14,
    borderWidth: 1,
    height: 29,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  statusChipActive: {
    backgroundColor: "#FFE8DF",
    borderColor: "#FF4A17",
  },
  statusChipText: {
    color: "#706A65",
    fontSize: 10,
    fontWeight: "800",
  },
  statusChipTextActive: {
    color: "#FF4A17",
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
