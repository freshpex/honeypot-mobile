import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons color="#171513" name="arrow-back" size={18} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
      </View>

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
    flex: 1,
    justifyContent: "center",
    paddingBottom: 170,
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
