import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { EmptyState, PaginationControls, Screen } from "@/components";
import { usePagination } from "@/shared/hooks";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";
import { communityService, type CommunityResponse } from "../services";

export const CommunityScreen = () => {
  const [community, setCommunity] = useState<CommunityResponse>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setCommunity(await communityService.getCommunity(1, 100));
      setError(undefined);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load community.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const reviews = useMemo(() => community?.reviews ?? [], [community?.reviews]);
  const reviewPages = usePagination(reviews);

  return (
    <Screen>
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name="people-outline" size={24} />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>HoneyPot Community</Text>
          <Text style={styles.heroSubtitle}>Meal reviews, healthy wins, and reward leaders.</Text>
        </View>
      </View>

      {error ? (
        <Pressable onPress={() => void load()} style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText}>Tap to retry</Text>
        </Pressable>
      ) : null}

      <Text style={styles.sectionTitle}>Top Members</Text>
      <View style={styles.leaderboard}>
        {(community?.leaderboard ?? []).slice(0, 3).map((member) => (
          <View key={`${member.rank}-${member.name}`} style={styles.leaderCard}>
            <Text style={styles.leaderRank}>#{member.rank}</Text>
            <Text numberOfLines={1} style={styles.leaderName}>{member.name}</Text>
            <Text style={styles.leaderPoints}>{member.points} pts</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Meal Reviews</Text>
      <View style={styles.reviewStack}>
        {reviewPages.pageItems.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            {review.photoUrls[0] ? (
              <Image source={{ uri: review.photoUrls[0] }} style={styles.reviewImage} />
            ) : null}
            <View style={styles.reviewHeader}>
              <View style={styles.flex}>
                <Text style={styles.reviewTitle}>{review.title}</Text>
                <Text style={styles.reviewMeta}>{review.mealName} by {review.reviewer}</Text>
              </View>
              <View style={styles.ratingPill}>
                <Ionicons color={resolveThemeColor("#FFB020")} name="star" size={11} />
                <Text style={styles.ratingText}>{review.rating}</Text>
              </View>
            </View>
            <Text style={styles.reviewBody}>{review.body}</Text>
          </View>
        ))}
        {!loading && !reviews.length ? (
          <EmptyState
            icon="chatbubble-ellipses-outline"
            message="Meal reviews and healthy wins will appear here once customers start sharing."
            title="No community reviews yet"
          />
        ) : null}
        <PaginationControls
          canGoNext={reviewPages.canGoNext}
          canGoPrevious={reviewPages.canGoPrevious}
          onNext={reviewPages.goNext}
          onPrevious={reviewPages.goPrevious}
          page={reviewPages.page}
          totalPages={reviewPages.totalPages}
        />
      </View>
    </Screen>
  );
};

const styles = createThemedStyleSheet({
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
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 13,
    marginBottom: 16,
    padding: 16,
    ...skeuo.deepCard,
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 46,
    justifyContent: "center",
    width: 46,
    ...skeuo.pressed,
  },
  heroSubtitle: {
    color: "#817B75",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
  leaderboard: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  leaderCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: 82,
    padding: 10,
    ...skeuo.card,
  },
  leaderName: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
    marginTop: 8,
    textAlign: "center",
  },
  leaderPoints: {
    color: "#817B75",
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
  },
  leaderRank: {
    color: "#FF4A17",
    fontSize: 13,
    fontWeight: "900",
  },
  ratingPill: {
    alignItems: "center",
    backgroundColor: "#FFF4D8",
    borderRadius: 10,
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    color: "#9A6500",
    fontSize: 10,
    fontWeight: "900",
  },
  retryText: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
  },
  reviewBody: {
    color: "#706A65",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 11,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    padding: 13,
    ...skeuo.card,
  },
  reviewHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  reviewImage: {
    borderRadius: 10,
    height: 132,
    marginBottom: 12,
    width: "100%",
  },
  reviewMeta: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 3,
  },
  reviewStack: {
    gap: 10,
  },
  reviewTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
});
