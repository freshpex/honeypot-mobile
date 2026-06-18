import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore, useSubscriptionStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import { dashboardService, type DashboardHomeResponse } from "../services";

export const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const authName = useAuthStore((state) => state.name);
  const {
    daysRemaining,
    expiresDate,
    load,
    pause,
    pauseResumeDate,
    resume,
    selectedPlan,
    status,
  } = useSubscriptionStore();
  const [activeAction, setActiveAction] = useState<string>();
  const [homeData, setHomeData] = useState<DashboardHomeResponse>();

  const isPaused = status === "paused";

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let mounted = true;
    const loadHome = async () => {
      try {
        const response = await dashboardService.getHome();
        if (mounted) {
          setHomeData(response);
        }
      } catch {
        if (mounted) {
          setHomeData(undefined);
        }
      }
    };
    void loadHome();
    return () => {
      mounted = false;
    };
  }, []);

  const quickActions = useMemo(
    () => [
      {
        icon: "restaurant-outline",
        label: "Choose Meals",
        tint: "#FFEAE2",
        color: "#FF4A17",
        onPress: () => navigation.navigate("Meals"),
      },
      {
        icon: "bag-handle-outline",
        label: "One-Off Order",
        tint: "#FFF4D8",
        color: "#302A26",
        onPress: () => navigation.navigate("Orders"),
      },
      {
        icon: "refresh-outline",
        label: "Renew Plan",
        tint: "#E8FBF3",
        color: "#26B97A",
        onPress: () => navigation.navigate("Plan"),
      },
      {
        icon: "pause-outline",
        label: "Pause Plan",
        tint: "#FFF8DF",
        color: "#F2A300",
        onPress: () => {
          void pause(7);
        },
      },
      {
        icon: "play-outline",
        label: "Resume Plan",
        tint: "#E8F7FF",
        color: "#1A9BE8",
        onPress: () => {
          void resume();
        },
      },
      {
        icon: "gift-outline",
        label: "Gift Plan",
        tint: "#F0EAFE",
        color: "#7E48E8",
        onPress: () => navigation.navigate("Plan"),
      },
    ] satisfies {
      color: string;
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      onPress: () => void;
      tint: string;
    }[],
    [navigation, pause, resume],
  );

  const statusCards = useMemo(
    () => [
      { icon: "flame-outline", label: "Meals Left", value: selectedPlan.meals },
      { icon: "time-outline", label: "Days Left", value: String(daysRemaining) },
      { icon: "calendar-outline", label: "Expires", value: expiresDate },
    ] satisfies {
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      value: string;
    }[],
    [daysRemaining, expiresDate, selectedPlan.meals],
  );

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.name}>Hello, {homeData?.greetingName ?? authName ?? "there"}</Text>
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate("Plan")} style={styles.statusCard}>
          <View style={styles.statusTop}>
            <View>
              <View style={[styles.badge, isPaused ? styles.pausedBadge : styles.activeBadge]}>
                <Text
                  style={[
                    styles.badgeText,
                    isPaused ? styles.pausedBadgeText : styles.activeBadgeText,
                  ]}
                >
                  {isPaused ? "Paused" : "Active"}
                </Text>
              </View>
              <Text style={styles.statusTitle}>{selectedPlan.name} Plan</Text>
            </View>
            <View style={styles.arrowBubble}>
              <Ionicons color={resolveThemeColor("#FF4A17")} name="chevron-forward" size={18} />
            </View>
          </View>

          {isPaused ? (
            <View style={styles.pausedBanner}>
              <Ionicons color={resolveThemeColor("#F0A000")} name="pause-outline" size={15} />
              <Text style={styles.pausedBannerText}>Paused until {pauseResumeDate}</Text>
            </View>
          ) : null}

          <View style={styles.homeStats}>
            {statusCards.map((card) => (
              <View key={card.label} style={styles.homeStatCard}>
                <Ionicons color={resolveThemeColor("#FF4A17")} name={card.icon} size={15} />
                <Text style={styles.homeStatValue}>{card.value}</Text>
                <Text style={styles.homeStatLabel}>{card.label}</Text>
              </View>
            ))}
          </View>
        </Pressable>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {quickActions.map((action) => {
            const isActive = activeAction === action.label;
            return (
              <Pressable
                key={action.label}
                onPress={() => {
                  setActiveAction(action.label);
                  action.onPress();
                }}
                style={[styles.quickCard, isActive && styles.quickCardActive]}
              >
                <View style={[styles.quickIcon, { backgroundColor: resolveThemeColor(action.tint) }]}>
                  <Ionicons color={resolveThemeColor(action.color)} name={action.icon} size={21} />
                </View>
                <Text style={styles.quickLabel}>{action.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Upcoming Deliveries</Text>
        <View style={styles.emptyDelivery}>
          {homeData?.upcomingDeliveries.length ? (
            homeData.upcomingDeliveries.slice(0, 3).map((order) => (
              <View key={order.id} style={styles.deliveryRow}>
                <Ionicons color={resolveThemeColor("#FF4A17")} name="car-outline" size={18} />
                <View style={styles.deliveryTextWrap}>
                  <Text style={styles.deliveryTitle}>#{order.reference}</Text>
                  <Text style={styles.deliverySubtitle}>
                    {order.status} · {formatDashboardDate(order.date)}
                  </Text>
                </View>
                <Text style={styles.deliveryAmount}>₦{order.total.toLocaleString("en-NG")}</Text>
              </View>
            ))
          ) : (
            <>
              <Ionicons color={resolveThemeColor("#C9C5C1")} name="car-outline" size={32} />
              <Text style={styles.emptyText}>No upcoming deliveries</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = createThemedStyleSheet({
  activeBadge: {
    backgroundColor: "#CFF8DF",
  },
  activeBadgeText: {
    color: "#087A3B",
  },
  arrowBubble: {
    alignItems: "center",
    backgroundColor: "#FFE0D6",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  badge: {
    alignItems: "center",
    borderRadius: 11,
    height: 22,
    justifyContent: "center",
    marginBottom: 7,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  bell: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  content: {
    paddingBottom: 24,
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  emptyDelivery: {
    alignItems: "center",
    minHeight: 92,
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    color: "#8B8580",
    fontSize: 12,
    marginTop: 7,
  },
  deliveryAmount: {
    color: "#FF4A17",
    fontSize: 11,
    fontWeight: "900",
  },
  deliveryRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 9,
    borderTopWidth: 1,
    elevation: 3,
    flexDirection: "row",
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 12,
    width: "100%",
    ...skeuo.card,
  },
  deliverySubtitle: {
    color: "#817B75",
    fontSize: 9,
    marginTop: 2,
  },
  deliveryTextWrap: {
    flex: 1,
  },
  deliveryTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  greeting: {
    color: "#8B8580",
    fontSize: 12,
    marginBottom: 2,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 19,
  },
  homeStatCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 3,
    flex: 1,
    height: 58,
    justifyContent: "center",
  },
  homeStatLabel: {
    color: "#817B75",
    fontSize: 9,
    marginTop: 2,
  },
  homeStats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 17,
  },
  homeStatValue: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
    marginTop: 4,
  },
  name: {
    color: "#171513",
    fontSize: 17,
    fontWeight: "800",
  },
  pausedBadge: {
    backgroundColor: "#FFF0C9",
  },
  pausedBadgeText: {
    color: "#9A6A00",
  },
  pausedBanner: {
    alignItems: "center",
    backgroundColor: "#FFF8DD",
    borderColor: "#F3DE98",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    height: 31,
    marginTop: 11,
    paddingHorizontal: 13,
  },
  pausedBannerText: {
    color: "#B46F00",
    fontSize: 12,
    fontWeight: "600",
  },
  quickCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 4,
    height: 66,
    justifyContent: "center",
    width: "31%",
    ...skeuo.card,
  },
  quickCardActive: {
    borderColor: "#C8320D",
    borderWidth: 1,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 28,
    justifyContent: "center",
    marginBottom: 7,
    width: 28,
  },
  quickLabel: {
    color: "#171513",
    fontSize: 10,
    fontWeight: "600",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  statusCard: {
    backgroundColor: "#FFF0E9",
    borderColor: "#FFCCBA",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 7,
    marginBottom: 20,
    padding: 14,
    ...skeuo.deepCard,
  },
  statusTitle: {
    color: "#171513",
    fontSize: 15,
    fontWeight: "900",
  },
  statusTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const formatDashboardDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
