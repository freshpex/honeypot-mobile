import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const OrdersScreen = () => {
  const tabs = useMemo(() => ["Active", "Delivered", "Cancelled"], []);
  const [activeTab, setActiveTab] = useState("Active");

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>Track your meal orders</Text>

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

        <View style={styles.emptyState}>
          <Ionicons color="#C9C5C1" name="cube-outline" size={32} />
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  activeSegmentItem: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 5,
  },
  activeSegmentText: {
    color: "#171513",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 7,
    paddingTop: 12,
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
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  segment: {
    backgroundColor: "#F1EFED",
    borderRadius: 8,
    flexDirection: "row",
    height: 22,
    marginTop: 18,
    padding: 1,
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

