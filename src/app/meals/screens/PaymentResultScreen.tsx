import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";
import type { MealsStackParamList } from "../types";

type PaymentResultScreenProps = NativeStackScreenProps<MealsStackParamList, "PaymentResult">;

const resultCopy = {
  cancelled: {
    color: "#B46F00",
    icon: "time-outline",
    title: "Payment not completed",
  },
  failed: {
    color: "#C8320D",
    icon: "close-circle-outline",
    title: "Payment failed",
  },
  pending: {
    color: "#B46F00",
    icon: "time-outline",
    title: "Order awaiting payment",
  },
  success: {
    color: "#08A46B",
    icon: "checkmark-circle-outline",
    title: "Payment successful",
  },
} satisfies Record<
  MealsStackParamList["PaymentResult"]["status"],
  { color: string; icon: keyof typeof Ionicons.glyphMap; title: string }
>;

export const PaymentResultScreen = ({ navigation, route }: PaymentResultScreenProps) => {
  const copy = resultCopy[route.params.status];
  const message =
    route.params.message ??
    (route.params.status === "success"
      ? "Your order has been confirmed and sent to the kitchen."
      : route.params.status === "pending"
        ? "Your order is saved. Complete payment from Orders to send it to the kitchen."
        : "No payment was captured. You can retry when ready.");

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: resolveThemeColor(`${copy.color}1A`) }]}>
          <Ionicons color={resolveThemeColor(copy.color)} name={copy.icon} size={42} />
        </View>
        <Text style={styles.title}>{copy.title}</Text>
        {route.params.orderReference ? (
          <Text style={styles.reference}>#{route.params.orderReference}</Text>
        ) : null}
        <Text style={styles.message}>{message}</Text>

        <Pressable
          onPress={() => navigation.getParent()?.navigate("Orders")}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryText}>View Orders</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("Menu")} style={styles.secondaryButton}>
          <Text style={styles.secondaryText}>Browse Meals</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = createThemedStyleSheet({
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
  },
  iconWrap: {
    alignItems: "center",
    borderColor: "#FFFFFF",
    borderRadius: 38,
    borderTopWidth: 1,
    elevation: 5,
    height: 76,
    justifyContent: "center",
    marginBottom: 20,
    width: 76,
    ...skeuo.card,
  },
  message: {
    color: "#817B75",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
    marginTop: 10,
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderColor: "#FF8B68",
    borderRadius: 10,
    borderTopWidth: 1,
    elevation: 6,
    height: 42,
    justifyContent: "center",
    width: "100%",
    ...skeuo.action,
  },
  primaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  reference: {
    color: "#FF4A17",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 5,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    height: 40,
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
    ...skeuo.card,
  },
  secondaryText: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "800",
  },
  title: {
    color: "#171513",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },
});
