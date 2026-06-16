import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { skeuo } from "@/shared/theme";

export const NotificationsScreen = () => {
  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.emptyState}>
        <Ionicons color="#D1CDC9" name="notifications-outline" size={34} />
        <Text style={styles.emptyText}>No notifications yet</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 17,
    borderWidth: StyleSheet.hairlineWidth,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 14,
    borderTopWidth: 1,
    elevation: 4,
    flex: 1,
    justifyContent: "center",
    margin: 20,
    paddingBottom: 170,
    ...skeuo.card,
  },
  emptyText: {
    color: "#8B8580",
    fontSize: 12,
    marginTop: 8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
    paddingHorizontal: 13,
    paddingTop: 11,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  title: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "900",
  },
});
