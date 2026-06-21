import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PaginationControls, Screen } from "@/components";
import { usePagination } from "@/shared/hooks";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";
import { loyaltyService, type LoyaltySummary } from "../services";

export const LoyaltyScreen = () => {
  const [summary, setSummary] = useState<LoyaltySummary>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSummary(await loyaltyService.getSummary(100));
      setError(undefined);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load rewards.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const transactions = useMemo(() => summary?.transactions ?? [], [summary?.transactions]);
  const transactionPages = usePagination(transactions);
  const progress = useMemo(() => {
    if (!summary?.nextTier) return 1;
    return Math.min(1, summary.balance / summary.nextTier.pointsRequired);
  }, [summary]);

  return (
    <Screen>
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <Ionicons color={resolveThemeColor("#FF4A17")} name="gift-outline" size={22} />
          </View>
          <View>
            <Text style={styles.kicker}>{summary?.tier ?? "Honey Bee"}</Text>
            <Text style={styles.points}>{summary?.balance ?? 0} points</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.heroNote}>
          {summary?.nextTier
            ? `${summary.nextTier.pointsRequired - summary.balance} points to ${summary.nextTier.name}`
            : "Top loyalty tier unlocked"}
        </Text>
      </View>

      {error ? (
        <Pressable onPress={() => void load()} style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText}>Tap to retry</Text>
        </Pressable>
      ) : null}

      <Text style={styles.sectionTitle}>Leaderboard</Text>
      <View style={styles.cardStack}>
        {(summary?.leaderboard ?? []).map((row) => (
          <View key={`${row.rank}-${row.name}`} style={styles.listCard}>
            <Text style={styles.rank}>#{row.rank}</Text>
            <Text style={styles.listTitle}>{row.name}</Text>
            <Text style={styles.listMeta}>{row.points} pts</Text>
          </View>
        ))}
        {!loading && !summary?.leaderboard.length ? <Text style={styles.emptyText}>No leaderboard yet</Text> : null}
      </View>

      <Text style={styles.sectionTitle}>Point Activity</Text>
      <View style={styles.cardStack}>
        {transactionPages.pageItems.map((item) => (
          <View key={item.id} style={styles.listCard}>
            <View style={styles.transactionIcon}>
              <Ionicons color={resolveThemeColor(item.points >= 0 ? "#2CC979" : "#FF4A17")} name="sparkles-outline" size={15} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.listTitle}>{item.description}</Text>
              <Text style={styles.listSubtitle}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={[styles.listMeta, item.points < 0 && styles.negativeMeta]}>
              {item.points > 0 ? "+" : ""}{item.points}
            </Text>
          </View>
        ))}
        <PaginationControls
          canGoNext={transactionPages.canGoNext}
          canGoPrevious={transactionPages.canGoPrevious}
          onNext={transactionPages.goNext}
          onPrevious={transactionPages.goPrevious}
          page={transactionPages.page}
          totalPages={transactionPages.totalPages}
        />
      </View>
    </Screen>
  );
};

const styles = createThemedStyleSheet({
  cardStack: {
    gap: 10,
  },
  emptyText: {
    color: "#817B75",
    fontSize: 12,
    textAlign: "center",
  },
  errorCard: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
    padding: 12,
    ...skeuo.card,
  },
  errorText: {
    color: "#C8320D",
    fontSize: 12,
    fontWeight: "800",
  },
  flex: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 18,
    padding: 18,
    ...skeuo.deepCard,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    height: 44,
    justifyContent: "center",
    width: 44,
    ...skeuo.pressed,
  },
  heroNote: {
    color: "#817B75",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 10,
  },
  heroTop: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  kicker: {
    color: "#C8320D",
    fontSize: 12,
    fontWeight: "900",
  },
  listCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    padding: 12,
    ...skeuo.card,
  },
  listMeta: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
  },
  listSubtitle: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 3,
  },
  listTitle: {
    color: "#171513",
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
  },
  negativeMeta: {
    color: "#FF4A17",
  },
  points: {
    color: "#171513",
    fontSize: 24,
    fontWeight: "900",
  },
  progressFill: {
    backgroundColor: "#FF4A17",
    borderRadius: 5,
    height: 10,
  },
  progressTrack: {
    backgroundColor: "#FFD1C1",
    borderRadius: 5,
    height: 10,
    marginTop: 18,
    overflow: "hidden",
  },
  rank: {
    color: "#FF4A17",
    fontSize: 13,
    fontWeight: "900",
    width: 34,
  },
  retryText: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 4,
  },
  transactionIcon: {
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
});
