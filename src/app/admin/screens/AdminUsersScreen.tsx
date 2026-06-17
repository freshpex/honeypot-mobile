import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { ADMIN_PAGE_SIZE, useAdminStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet } from "@/shared/theme";
import {
  AdminActionButton,
  AdminCard,
  AdminPill,
  AdminScreen,
  AdminSectionTitle,
} from "./AdminShared";

export const AdminUsersScreen = () => {
  const users = useAdminStore((state) => state.users);
  const toggleUserStatus = useAdminStore((state) => state.toggleUserStatus);
  const loadUsers = useAdminStore((state) => state.loadUsers);
  const pagination = usePagination(users, ADMIN_PAGE_SIZE);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const summary = useMemo(
    () => ({
      active: users.filter((user) => user.status === "Active").length,
      paused: users.filter((user) => user.status === "Paused").length,
      suspended: users.filter((user) => user.status === "Suspended").length,
    }),
    [users],
  );


  return (
    <AdminScreen>
      <AdminSectionTitle subtitle="Review customers, subscriptions, and access status." title="Manage Users" />
      <View style={styles.summaryRow}>
        <AdminPill label={`${summary.active} active`} tone="green" />
        <AdminPill label={`${summary.paused} paused`} tone="yellow" />
        <AdminPill label={`${summary.suspended} suspended`} tone="red" />
      </View>

      {pagination.pageItems.map((user) => (
        <AdminCard key={user.id}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
              <Text style={styles.plan}>{user.plan} plan</Text>
            </View>
            <AdminPill
              label={user.status}
              tone={user.status === "Active" ? "green" : user.status === "Paused" ? "yellow" : "red"}
            />
          </View>
          <View style={styles.actions}>
            <AdminActionButton onPress={() => void toggleUserStatus(user.id)}>
              {user.status === "Suspended" ? "Reactivate" : "Toggle Status"}
            </AdminActionButton>
            <View style={styles.secondaryAction}>
              <Ionicons color={resolveThemeColor("#817B75")} name="document-text-outline" size={15} />
              <Text style={styles.secondaryText}>View profile</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <UserStat label="Orders" value={String(user.stats.totalOrders)} />
            <UserStat label="Active" value={String(user.stats.activeOrders)} />
            <UserStat label="Delivered" value={String(user.stats.deliveredOrders)} />
            <UserStat label="Spend" value={`₦${user.stats.totalSpend.toLocaleString()}`} />
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

const UserStat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = createThemedStyleSheet({
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 16,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  avatarText: {
    color: "#FF4A17",
    fontSize: 16,
    fontWeight: "900",
  },
  email: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 2,
  },
  plan: {
    color: "#4F4640",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 5,
  },
  secondaryAction: {
    alignItems: "center",
    backgroundColor: "#F8F6F4",
    borderRadius: 9,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    height: 36,
    justifyContent: "center",
  },
  secondaryText: {
    color: "#817B75",
    fontSize: 11,
    fontWeight: "800",
  },
  statBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderTopWidth: 1,
    elevation: 3,
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  statLabel: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 3,
  },
  statValue: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  userName: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
  },
  userRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
  },
  userText: {
    flex: 1,
  },
});
