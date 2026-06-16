import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import {
  DELIVERY_FEE,
  formatNaira,
  getCartItemCount,
  getCartSubtotal,
  useMealCartStore,
} from "@/shared/state";
import type { MealsStackParamList } from "../types";
import { CartBar } from "./MenuScreen";

type CartScreenProps = NativeStackScreenProps<MealsStackParamList, "Cart">;

export const CartScreen = ({ navigation }: CartScreenProps) => {
  const items = useMealCartStore((state) => state.items);
  const decrementMeal = useMealCartStore((state) => state.decrementMeal);
  const incrementMeal = useMealCartStore((state) => state.incrementMeal);
  const removeMeal = useMealCartStore((state) => state.removeMeal);
  const itemCount = useMemo(() => getCartItemCount(items), [items]);
  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const total = subtotal + DELIVERY_FEE;
  const cartPagination = usePagination(items);

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>{itemCount} items</Text>
          <View style={styles.itemList}>
            {cartPagination.pageItems.map((item) => (
              <View key={item.meal.id} style={styles.cartItem}>
                <View style={styles.cartItemText}>
                  <Text style={styles.itemName}>{item.meal.name}</Text>
                  <Text style={styles.itemPrice}>{formatNaira(item.meal.price)}</Text>
                </View>
                <View style={styles.itemActions}>
                  <Pressable
                    onPress={() => decrementMeal(item.meal.id)}
                    style={styles.roundButton}
                  >
                    <Text style={styles.roundButtonText}>−</Text>
                  </Pressable>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => incrementMeal(item.meal.id)}
                    style={styles.roundButton}
                  >
                    <Text style={styles.roundButtonText}>+</Text>
                  </Pressable>
                  <Pressable onPress={() => removeMeal(item.meal.id)} style={styles.deleteButton}>
                    <Ionicons color="#8B8580" name="trash-outline" size={15} />
                  </Pressable>
                </View>
              </View>
            ))}
            <PaginationControls
              canGoNext={cartPagination.canGoNext}
              canGoPrevious={cartPagination.canGoPrevious}
              onNext={cartPagination.goNext}
              onPrevious={cartPagination.goPrevious}
              page={cartPagination.page}
              totalPages={cartPagination.totalPages}
            />
          </View>

          <View style={styles.summaryCard}>
            <SummaryRow label="Subtotal" value={formatNaira(subtotal)} />
            <SummaryRow label="Delivery Fee" value={formatNaira(DELIVERY_FEE)} />
            <View style={styles.summaryDivider} />
            <SummaryRow bold label="Total" value={formatNaira(total)} />
          </View>

          <Pressable
            disabled={itemCount === 0}
            onPress={() => navigation.navigate("Checkout")}
            style={[styles.checkoutButton, itemCount === 0 && styles.disabledButton]}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout — {formatNaira(total)}</Text>
          </Pressable>
        </ScrollView>

        {itemCount > 0 ? (
          <CartBar
            count={itemCount}
            label="View cart"
            onPress={() => undefined}
            total={total}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
};

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
  cartItem: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 55,
    paddingHorizontal: 14,
  },
  cartItemText: {
    flex: 1,
  },
  checkoutButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 8,
    height: 34,
    justifyContent: "center",
    marginTop: 18,
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  content: {
    paddingBottom: 90,
    paddingHorizontal: 23,
    paddingTop: 19,
  },
  deleteButton: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    width: 22,
  },
  disabledButton: {
    opacity: 0.55,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 23,
    paddingTop: 24,
  },
  itemActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  itemList: {
    gap: 10,
  },
  itemName: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  itemPrice: {
    color: "#FF4A17",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 4,
  },
  quantity: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
    minWidth: 12,
    textAlign: "center",
  },
  roundButton: {
    alignItems: "center",
    backgroundColor: "#F1EFED",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  roundButtonText: {
    color: "#817B75",
    fontSize: 14,
    fontWeight: "900",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    marginTop: 18,
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
