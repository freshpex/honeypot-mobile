import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const SubscriptionsScreen = () => (
  <SafeAreaView edges={["top"]} style={styles.safeArea}>
    <View style={styles.content}>
      <Text style={styles.title}>Subscription</Text>
      <Text style={styles.subtitle}>Manage your meal plan</Text>

      <View style={styles.card}>
        <Ionicons color="#BDB8B3" name="calendar-outline" size={36} />
        <Text style={styles.cardTitle}>No Active Subscription</Text>
        <Text style={styles.cardCopy}>Choose a plan to start your healthy meal journey</Text>
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>View Plans</Text>
      </Pressable>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 8,
    height: 31,
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  card: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "#E7E1DC",
    borderRadius: 10,
    borderStyle: "dashed",
    borderWidth: StyleSheet.hairlineWidth,
    height: 153,
    justifyContent: "center",
    marginTop: 20,
  },
  cardCopy: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
  cardTitle: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 12,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
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

