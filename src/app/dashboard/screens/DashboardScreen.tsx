import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const DashboardScreen = () => {
  const quickActions = useMemo(
    () => [
      { icon: "restaurant-outline", label: "Choose Meals", tint: "#FFEAE2", color: "#FF4A17" },
      { icon: "bag-handle-outline", label: "One-Off Order", tint: "#FFF4D8", color: "#302A26" },
      { icon: "refresh-outline", label: "Renew Plan", tint: "#E8FBF3", color: "#26B97A" },
      { icon: "pause-outline", label: "Pause Plan", tint: "#FFF8DF", color: "#F2A300" },
      { icon: "play-outline", label: "Resume Plan", tint: "#E8F7FF", color: "#1A9BE8" },
      { icon: "clipboard-outline", label: "View Orders", tint: "#F0EAFE", color: "#7E48E8" },
    ] satisfies Array<{
      color: string;
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      tint: string;
    }>,
    [],
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>Hello, Enoch</Text>
          </View>
          <Pressable style={styles.bell}>
            <Ionicons color="#302A26" name="notifications-outline" size={20} />
          </Pressable>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons color="#8D8781" name="calendar-outline" size={22} />
          </View>
          <Text style={styles.statusTitle}>No Active Plan</Text>
          <Text style={styles.statusCopy}>
            Subscribe to start enjoying healthy meals delivered to your door
          </Text>
          <Pressable style={styles.subscribeButton}>
            <Text style={styles.subscribeText}>Subscribe Now</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <Pressable key={action.label} style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: action.tint }]}>
                <Ionicons color={action.color} name={action.icon} size={21} />
              </View>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Upcoming Deliveries</Text>
        <View style={styles.emptyDelivery}>
          <Ionicons color="#C9C5C1" name="car-outline" size={32} />
          <Text style={styles.emptyText}>No upcoming deliveries</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bell: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  content: {
    paddingBottom: 24,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  emptyDelivery: {
    alignItems: "center",
    height: 92,
    justifyContent: "center",
  },
  emptyText: {
    color: "#8B8580",
    fontSize: 12,
    marginTop: 7,
  },
  greeting: {
    color: "#8B8580",
    fontSize: 12,
    marginBottom: 2,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 19,
  },
  name: {
    color: "#171513",
    fontSize: 17,
    fontWeight: "800",
  },
  quickCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    height: 66,
    justifyContent: "center",
    width: "31%",
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 28,
    justifyContent: "center",
    marginBottom: 7,
    width: 28,
  },
  quickLabel: {
    color: "#171513",
    fontSize: 10,
    fontWeight: "600",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  statusCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.76)",
    borderColor: "#E7E1DC",
    borderRadius: 10,
    borderStyle: "dashed",
    borderWidth: StyleSheet.hairlineWidth,
    height: 151,
    justifyContent: "center",
    marginBottom: 19,
  },
  statusCopy: {
    color: "#817B75",
    fontSize: 12,
    marginBottom: 14,
    marginTop: 6,
    textAlign: "center",
  },
  statusIcon: {
    alignItems: "center",
    backgroundColor: "#F5F2EF",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    marginBottom: 12,
    width: 36,
  },
  statusTitle: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "800",
  },
  subscribeButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 116,
  },
  subscribeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
});

