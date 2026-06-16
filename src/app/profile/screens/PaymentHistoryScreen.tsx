import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { formatNaira, useCustomerStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import type { ProfileStackParamList } from "../types";

type PaymentHistoryScreenProps = NativeStackScreenProps<ProfileStackParamList, "PaymentHistory">;

export const PaymentHistoryScreen = (_props: PaymentHistoryScreenProps) => {
  const orders = useCustomerStore((state) => state.orders);
  const rows = useMemo(
    () =>
      orders.length
        ? orders.map((order) => ({
            amount: formatNaira(order.total),
            date: order.date,
            id: order.id,
            method:
              order.paymentMethod === "Card" && order.paymentCardLast4
                ? `Card •••• ${order.paymentCardLast4}`
                : order.paymentMethod,
            type: order.type,
          }))
        : [
            {
              amount: "₦4,300",
              date: "Jun 16, 2026",
              id: "#HP-MQGX3ZJL",
              method: "Card •••• 5380",
              type: "One Off",
            },
          ],
    [orders],
  );
  const historyPagination = usePagination(rows);

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.historyList}>
          {historyPagination.pageItems.map((row) => (
            <View key={row.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View>
                  <Text style={styles.orderId}>{row.id}</Text>
                  <Text style={styles.orderType}>{row.type}</Text>
                </View>
                <View style={styles.paidPill}>
                  <Ionicons color={resolveThemeColor("#12B76A")} name="checkmark" size={9} />
                  <Text style={styles.paidText}>Paid</Text>
                </View>
              </View>
              <View style={styles.historyFooter}>
                <View>
                  <Text style={styles.historyDate}>{row.date}</Text>
                  <Text style={styles.methodText}>{row.method}</Text>
                </View>
                <Text style={styles.amount}>{row.amount}</Text>
              </View>
            </View>
          ))}
          <PaginationControls
            canGoNext={historyPagination.canGoNext}
            canGoPrevious={historyPagination.canGoPrevious}
            onNext={historyPagination.goNext}
            onPrevious={historyPagination.goPrevious}
            page={historyPagination.page}
            totalPages={historyPagination.totalPages}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = createThemedStyleSheet({
  amount: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
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
  content: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 4,
    paddingHorizontal: 13,
    paddingVertical: 12,
    ...skeuo.card,
  },
  historyDate: {
    color: "#817B75",
    fontSize: 10,
    marginBottom: 10,
  },
  historyFooter: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 11,
  },
  historyHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyList: {
    gap: 9,
    marginTop: 18,
  },
  methodText: {
    color: "#817B75",
    fontSize: 10,
  },
  orderId: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  orderType: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 5,
  },
  paidPill: {
    alignItems: "center",
    backgroundColor: "#E9FFF3",
    borderRadius: 9,
    flexDirection: "row",
    gap: 3,
    height: 18,
    paddingHorizontal: 8,
  },
  paidText: {
    color: "#12B76A",
    fontSize: 8,
    fontWeight: "900",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  title: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
});
