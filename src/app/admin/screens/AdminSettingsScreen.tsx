import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useAdminStore, useAuthStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet } from "@/shared/theme";
import {
  AdminActionButton,
  AdminCard,
  AdminPill,
  AdminScreen,
  AdminSectionTitle,
} from "./AdminShared";

const settingLabels = {
  autoRenewals: "Auto-renew subscriptions",
  deliveryAlerts: "Delivery alerts",
  walletFunding: "Wallet funding",
};

export const AdminSettingsScreen = () => {
  const settings = useAdminStore((state) => state.settings);
  const toggleSetting = useAdminStore((state) => state.toggleSetting);
  const logout = useAuthStore((state) => state.logout);
  const email = useAuthStore((state) => state.email);

  return (
    <AdminScreen>
      <AdminSectionTitle subtitle="Control operational flags before backend rollout." title="Admin Settings" />
      {Object.entries(settings).map(([key, enabled]) => (
        <AdminCard key={key}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>{settingLabels[key as keyof typeof settingLabels]}</Text>
              <Text style={styles.settingSubtitle}>
                {enabled ? "Enabled for demo operations" : "Disabled until production setup"}
              </Text>
            </View>
            <Pressable
              onPress={() => toggleSetting(key as keyof typeof settings)}
              style={[styles.toggle, enabled && styles.toggleOn]}
            >
              <View style={[styles.knob, enabled && styles.knobOn]} />
            </Pressable>
          </View>
        </AdminCard>
      ))}

      <AdminCard>
        <View style={styles.adminRow}>
          <View style={styles.adminIcon}>
            <Ionicons color={resolveThemeColor("#FF4A17")} name="shield-checkmark-outline" size={22} />
          </View>
          <View style={styles.adminText}>
            <Text style={styles.settingTitle}>Admin session</Text>
            <Text style={styles.settingSubtitle}>Logged in as {email ?? "admin@honeypot.app"}.</Text>
          </View>
          <AdminPill label="Active" tone="green" />
        </View>
        <AdminActionButton onPress={() => void logout()}>Log Out</AdminActionButton>
      </AdminCard>
    </AdminScreen>
  );
};

const styles = createThemedStyleSheet({
  adminIcon: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 12,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  adminRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 13,
  },
  adminText: {
    flex: 1,
  },
  knob: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 20,
    transform: [{ translateX: 2 }],
    width: 20,
  },
  knobOn: {
    transform: [{ translateX: 24 }],
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingSubtitle: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  settingText: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  toggle: {
    backgroundColor: "#DCD6D0",
    borderRadius: 14,
    height: 24,
    justifyContent: "center",
    width: 48,
  },
  toggleOn: {
    backgroundColor: "#FF4A17",
  },
});
