import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { formatNaira, useCustomerStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import type { ProfileStackParamList } from "../types";

type PaymentHistoryScreenProps = NativeStackScreenProps<ProfileStackParamList, "PaymentHistory">;

export const PaymentHistoryScreen = (_props: PaymentHistoryScreenProps) => {
  const error = useCustomerStore((state) => state.error);
  const isSyncing = useCustomerStore((state) => state.isSyncing);
  const loadPaymentHistory = useCustomerStore((state) => state.loadPaymentHistory);
  const paymentHistory = useCustomerStore((state) => state.paymentHistory);
  const rows = useMemo(
    () =>
      paymentHistory.map((transaction) => ({
            amount: formatNaira(transaction.amount),
            date: new Date(transaction.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            id: `#${transaction.reference}`,
            method: transaction.paymentMethod
              ? `${transaction.paymentMethod.brand} •••• ${transaction.paymentMethod.last4}`
              : "Card",
            status: transaction.status,
            type: transaction.description,
          })),
    [paymentHistory],
  );
  const historyPagination = usePagination(rows);

  useEffect(() => {
    void loadPaymentHistory();
  }, [loadPaymentHistory]);

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isSyncing && !paymentHistory.length ? (
          <Text style={styles.stateText}>Loading payment history...</Text>
        ) : error ? (
          <EmptyState
            actionLabel="Retry"
            icon="alert-circle-outline"
            message={error}
            onActionPress={() => void loadPaymentHistory()}
            title="Unable to load payments"
          />
        ) : rows.length ? (
          <View style={styles.historyList}>
            {historyPagination.pageItems.map((row) => (
            <View key={row.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <View>
                  <Text style={styles.orderId}>{row.id}</Text>
                  <Text style={styles.orderType}>{row.type}</Text>
                </View>
                <View style={[styles.statusPill, statusStyle(row.status)]}>
                  <Ionicons color={resolveThemeColor(statusColor(row.status))} name={statusIcon(row.status)} size={9} />
                  <Text style={[styles.statusText, { color: resolveThemeColor(statusColor(row.status)) }]}>
                    {statusLabel(row.status)}
                  </Text>
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
        ) : (
          <EmptyState
            icon="receipt-outline"
            message="Successful, pending, and failed payment records will appear here."
            title="No payment history"
          />
        )}
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
  stateText: {
    color: "#817B75",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 30,
    textAlign: "center",
  },
  statusPill: {
    alignItems: "center",
    borderRadius: 9,
    flexDirection: "row",
    gap: 3,
    height: 18,
    paddingHorizontal: 8,
  },
  statusText: {
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

const statusLabel = (status: string) =>
  status === "PAID" ? "Paid" : status === "FAILED" ? "Failed" : status === "CANCELLED" ? "Cancelled" : "Pending";

const statusColor = (status: string) => {
  if (status === "PAID") return "#12B76A";
  if (status === "FAILED" || status === "CANCELLED") return "#C8320D";
  return "#E88700";
};

const statusIcon = (status: string): keyof typeof Ionicons.glyphMap =>
  status === "PAID" ? "checkmark" : status === "FAILED" || status === "CANCELLED" ? "close" : "time-outline";

const statusStyle = (status: string) => ({
  backgroundColor: resolveThemeColor(status === "PAID" ? "#E9FFF3" : status === "FAILED" || status === "CANCELLED" ? "#FFE8DF" : "#FFF8DD"),
});
