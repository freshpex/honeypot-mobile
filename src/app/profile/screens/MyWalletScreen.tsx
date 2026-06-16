import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import type { ProfileStackParamList } from "../types";

type MyWalletScreenProps = NativeStackScreenProps<ProfileStackParamList, "MyWallet">;

export const MyWalletScreen = (_props: MyWalletScreenProps) => {
  const [copiedField, setCopiedField] = useState<string | undefined>();

  const markCopied = (field: string) => {
    setCopiedField(field);
    setTimeout(() => setCopiedField(undefined), 1200);
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.fundCard}>
          <View style={styles.fundHeader}>
            <Ionicons color={resolveThemeColor("#FFFFFF")} name="wallet-outline" size={18} />
            <Text style={styles.fundTitle}>Fund Your Wallet</Text>
          </View>
          <Text style={styles.fundSubtitle}>
            Transfer to this account to top up your HoneyPot wallet
          </Text>
          <View style={styles.bankPanel}>
            <Text style={styles.bankLabel}>BANK NAME</Text>
            <Text style={styles.bankValue}>HoneyPot Microfinance Bank</Text>
            <View style={styles.divider} />
            <View style={styles.copyRow}>
              <View>
                <Text style={styles.bankLabel}>ACCOUNT NUMBER</Text>
                <Text style={styles.accountNumber}>020879502622</Text>
              </View>
              <CopyButton copied={copiedField === "account"} onPress={() => markCopied("account")} />
            </View>
            <View style={styles.divider} />
            <View style={styles.copyRow}>
              <View>
                <Text style={styles.bankLabel}>ACCOUNT NAME</Text>
                <Text style={styles.bankValue}>Enoch</Text>
              </View>
              <CopyButton copied={copiedField === "name"} onPress={() => markCopied("name")} />
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <Ionicons color={resolveThemeColor("#F59E0B")} name="alert-circle-outline" size={16} />
          <Text style={styles.noticeText}>
            Transfer any amount to your dedicated account above. Funds reflect within minutes and
            can be used to pay for orders at checkout.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Wallet Transactions</Text>
        <View style={styles.emptyState}>
          <Ionicons color={resolveThemeColor("#D1CDC9")} name="arrow-up-outline" size={28} />
          <Text style={styles.emptyText}>No wallet transactions yet</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const CopyButton = ({ copied, onPress }: { copied: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.copyButton}>
    <Ionicons color={resolveThemeColor("#FFFFFF")} name={copied ? "checkmark" : "copy-outline"} size={17} />
  </Pressable>
);

const styles = createThemedStyleSheet({
  accountNumber: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: 2,
    marginTop: 3,
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
  bankLabel: {
    color: "#FFE8DF",
    fontSize: 9,
    fontWeight: "900",
    marginBottom: 3,
  },
  bankPanel: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 10,
    borderColor: "rgba(255,255,255,0.2)",
    borderTopWidth: 1,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bankValue: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  content: {
    paddingBottom: 100,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  copyButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.24)",
    borderRadius: 16,
    borderColor: "rgba(255,255,255,0.32)",
    borderTopWidth: 1,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  copyRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    backgroundColor: "rgba(255,255,255,0.25)",
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  emptyState: {
    alignItems: "center",
    height: 180,
    justifyContent: "center",
  },
  emptyText: {
    color: "#817B75",
    fontSize: 13,
    marginTop: 10,
  },
  fundCard: {
    backgroundColor: "#FF4A17",
    borderRadius: 11,
    borderColor: "#FF8B68",
    borderTopWidth: 1,
    elevation: 8,
    marginTop: 17,
    padding: 16,
    ...skeuo.action,
  },
  fundHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  fundSubtitle: {
    color: "#FFFFFF",
    fontSize: 11,
    marginTop: 13,
  },
  fundTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  notice: {
    alignItems: "flex-start",
    backgroundColor: "#FFF8E4",
    borderColor: "#F8D889",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    flexDirection: "row",
    gap: 9,
    marginTop: 17,
    padding: 12,
    ...skeuo.card,
  },
  noticeText: {
    color: "#9A6500",
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 24,
  },
  title: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
});
