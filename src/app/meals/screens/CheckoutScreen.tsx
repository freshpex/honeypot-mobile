import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DELIVERY_FEE,
  formatNaira,
  getCartItemCount,
  getCartSubtotal,
  useCustomerStore,
  useMealCartStore,
} from "@/shared/state";
import type { MealsStackParamList } from "../types";
import { CartBar } from "./MenuScreen";

type CheckoutScreenProps = NativeStackScreenProps<MealsStackParamList, "Checkout">;

export const CheckoutScreen = ({ navigation }: CheckoutScreenProps) => {
  const items = useMealCartStore((state) => state.items);
  const clearCart = useMealCartStore((state) => state.clearCart);
  const addOrder = useCustomerStore((state) => state.addOrder);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet");
  const itemCount = useMemo(() => getCartItemCount(items), [items]);
  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const total = subtotal + DELIVERY_FEE;

  const handleConfirmOrder = () => {
    if (!items.length) {
      return;
    }
    addOrder({
      items,
      paymentMethod: paymentMethod === "wallet" ? "Wallet" : "Card",
      total,
      type: "One Off",
    });
    clearCart();
    navigation.getParent()?.navigate("Orders");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons color="#171513" name="arrow-back" size={17} />
          </Pressable>
          <Text style={styles.title}>Checkout</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>
            <Ionicons color="#FF4A17" name="location-outline" size={13} /> Delivery Location
          </Text>
          <Pressable style={styles.addLocationRow}>
            <Text style={styles.plus}>＋</Text>
            <Text style={styles.addLocationText}>Add new location</Text>
          </Pressable>

          <Text style={styles.sectionLabel}>
            <Ionicons color="#FF4A17" name="card-outline" size={13} /> Payment Method
          </Text>
          <PaymentOption
            active={paymentMethod === "wallet"}
            icon="wallet-outline"
            subtitle="Pay from your wallet balance"
            tint="#FFF4D8"
            title="HoneyPot Wallet"
            onPress={() => setPaymentMethod("wallet")}
          />
          <PaymentOption
            active={paymentMethod === "card"}
            icon="card-outline"
            subtitle="Pay securely with your card"
            tint="#EBF7FF"
            title="Debit / Credit Card"
            onPress={() => setPaymentMethod("card")}
          />
          <Pressable style={styles.manageRow}>
            <Text style={styles.plus}>＋</Text>
            <Text style={styles.manageText}>Manage payment methods</Text>
            <Ionicons color="#8B8580" name="chevron-forward" size={15} />
          </Pressable>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <SummaryRow label="Subtotal" value={formatNaira(subtotal)} />
            <SummaryRow label="Delivery Fee" value={formatNaira(DELIVERY_FEE)} />
            <View style={styles.summaryDivider} />
            <SummaryRow bold label="Total" value={formatNaira(total)} />
          </View>

          <Pressable onPress={handleConfirmOrder} style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirm Order — {formatNaira(total)}</Text>
          </Pressable>
        </ScrollView>

        {itemCount > 0 ? (
          <CartBar
            count={itemCount}
            label="View cart"
            onPress={() => navigation.navigate("Cart")}
            total={total}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const PaymentOption = ({
  active,
  icon,
  onPress,
  subtitle,
  tint,
  title,
}: {
  active: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  subtitle: string;
  tint: string;
  title: string;
}) => (
  <Pressable onPress={onPress} style={[styles.paymentOption, active && styles.paymentOptionActive]}>
    <View style={[styles.paymentIcon, { backgroundColor: tint }]}>
      <Ionicons color={icon === "wallet-outline" ? "#FFB020" : "#34A8F4"} name={icon} size={18} />
    </View>
    <View style={styles.paymentTextWrap}>
      <Text style={styles.paymentTitle}>{title}</Text>
      <Text style={styles.paymentSubtitle}>{subtitle}</Text>
    </View>
    <View style={[styles.radio, active && styles.radioActive]}>
      {active ? <View style={styles.radioDot} /> : null}
    </View>
  </Pressable>
);

const SummaryRow = ({
  bold,
  label,
  value,
}: {
  bold?: boolean;
  label: string;
  value: string;
}) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && styles.summaryLabelBold]}>{label}</Text>
    <Text style={[styles.summaryValue, bold && styles.summaryValueBold]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  addLocationRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEAE6",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    height: 38,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 12,
  },
  addLocationText: {
    color: "#817B75",
    fontSize: 11,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 15,
    borderWidth: StyleSheet.hairlineWidth,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: "#FFA083",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    marginTop: 18,
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  content: {
    paddingBottom: 90,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  manageRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    height: 37,
    marginBottom: 17,
    paddingHorizontal: 12,
  },
  manageText: {
    color: "#817B75",
    flex: 1,
    fontSize: 11,
  },
  paymentIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  paymentOption: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEEAE6",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 55,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  paymentOptionActive: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FF4A17",
  },
  paymentSubtitle: {
    color: "#817B75",
    fontSize: 9,
    marginTop: 2,
  },
  paymentTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  paymentTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  plus: {
    color: "#817B75",
    fontSize: 14,
  },
  radio: {
    alignItems: "center",
    borderColor: "#D6D0CB",
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: "center",
    width: 16,
  },
  radioActive: {
    borderColor: "#FF4A17",
  },
  radioDot: {
    backgroundColor: "#FF4A17",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  sectionLabel: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  summaryDivider: {
    backgroundColor: "#EEEAE6",
    height: StyleSheet.hairlineWidth,
    marginVertical: 9,
  },
  summaryLabel: {
    color: "#9A948F",
    fontSize: 11,
  },
  summaryLabelBold: {
    color: "#171513",
    fontWeight: "900",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  summaryTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 9,
  },
  summaryValue: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "700",
  },
  summaryValueBold: {
    color: "#FF4A17",
    fontWeight: "900",
  },
  title: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
});
