import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { useAdminStore } from "@/shared/state";
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
  const pagination = usePagination(users);

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
            <AdminActionButton onPress={() => toggleUserStatus(user.id)}>
              {user.status === "Suspended" ? "Reactivate" : "Toggle Status"}
            </AdminActionButton>
            <View style={styles.secondaryAction}>
              <Ionicons color="#817B75" name="document-text-outline" size={15} />
              <Text style={styles.secondaryText}>View profile</Text>
            </View>
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

const styles = StyleSheet.create({
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
