import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import type { ProfileStackParamList } from "../types";

type MyWalletScreenProps = NativeStackScreenProps<ProfileStackParamList, "MyWallet">;

export const MyWalletScreen = (_props: MyWalletScreenProps) => {
  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.fundCard}>
          <View style={styles.fundHeader}>
            <Ionicons color={resolveThemeColor("#FFFFFF")} name="wallet-outline" size={18} />
            <Text style={styles.fundTitle}>HoneyPot Wallet</Text>
          </View>
          <Text style={styles.fundSubtitle}>
            Coming Soon · wallet funding is not available yet.
          </Text>
          <View style={styles.comingSoonBanner}>
            <Ionicons color={resolveThemeColor("#9A6500")} name="alert-circle-outline" size={17} />
            <Text style={styles.comingSoonText}>
              Please do not transfer funds to any HoneyPot wallet account until this feature is launched.
            </Text>
          </View>
          <View style={styles.bankPanel}>
            <Text style={styles.bankLabel}>BANK NAME</Text>
            <Text style={styles.bankValue}>Coming Soon</Text>
            <View style={styles.divider} />
            <View style={styles.copyRow}>
              <View>
                <Text style={styles.bankLabel}>ACCOUNT NUMBER</Text>
                <Text style={styles.accountNumber}>Unavailable</Text>
              </View>
              <View style={styles.disabledCopyButton}>
                <Ionicons color={resolveThemeColor("#FFFFFF")} name="lock-closed-outline" size={17} />
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.copyRow}>
              <View>
                <Text style={styles.bankLabel}>ACCOUNT NAME</Text>
                <Text style={styles.bankValue}>Not active</Text>
              </View>
              <View style={styles.disabledCopyButton}>
                <Ionicons color={resolveThemeColor("#FFFFFF")} name="lock-closed-outline" size={17} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <Ionicons color={resolveThemeColor("#F59E0B")} name="alert-circle-outline" size={16} />
          <Text style={styles.noticeText}>
            Wallet payments and bank transfers are coming soon. For now, use a saved debit or
            credit card at checkout.
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
  comingSoonBanner: {
    alignItems: "flex-start",
    backgroundColor: "#FFF8E4",
    borderColor: "rgba(255,255,255,0.34)",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    marginTop: 13,
    padding: 10,
  },
  comingSoonText: {
    color: "#9A6500",
    flex: 1,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
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
  disabledCopyButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 16,
    borderColor: "rgba(255,255,255,0.22)",
    borderTopWidth: 1,
    height: 32,
    justifyContent: "center",
    opacity: 0.65,
    width: 32,
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
