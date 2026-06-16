import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  type SubscriptionPlan,
  useSubscriptionStore,
} from "@/shared/state";

export const SubscriptionsScreen = () => {
  const {
    daysRemaining,
    endDate,
    pause,
    pauseResumeDate,
    plans,
    resume,
    selectedPlan,
    startDate,
    status,
    subscribe,
  } = useSubscriptionStore();
  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);
  const [isPauseSheetOpen, setIsPauseSheetOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(selectedPlan);

  const isPaused = status === "paused";
  const isInactive = status === "inactive";

  const stats = useMemo(
    () => [
      {
        icon: "flame-outline",
        label: "Meals remaining",
        value: selectedPlan.meals,
      },
      {
        icon: "time-outline",
        label: "Days remaining",
        value: String(daysRemaining),
      },
      {
        icon: "calendar-outline",
        label: "Start date",
        value: startDate,
      },
      {
        icon: "calendar-outline",
        label: "End date",
        value: endDate,
      },
    ] satisfies Array<{
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      value: string;
    }>,
    [daysRemaining, endDate, selectedPlan.meals, startDate],
  );

  const handleSubscribe = () => {
    subscribe(pendingPlan);
    setIsPlanSheetOpen(false);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Subscription</Text>
        <Text style={styles.subtitle}>Manage your meal plan</Text>

        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <View style={[styles.badge, isPaused ? styles.pausedBadge : styles.activeBadge]}>
                <Text style={[styles.badgeText, isPaused ? styles.pausedBadgeText : styles.activeBadgeText]}>
                  {isPaused ? "Paused" : "Active"}
                </Text>
              </View>
              <Text style={styles.planName}>{selectedPlan.name} Plan</Text>
            </View>
            <Text style={styles.price}>{selectedPlan.price}</Text>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Ionicons color="#FF4A17" name={stat.icon} size={18} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {isPaused ? (
            <View style={styles.pausedNotice}>
              <Ionicons color="#F0A000" name="pause-outline" size={17} />
              <View>
                <Text style={styles.pausedTitle}>Subscription Paused</Text>
                <Text style={styles.pausedCopy}>Resumes on {pauseResumeDate}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {isPaused ? (
          <Pressable onPress={resume} style={styles.resumeButton}>
            <Ionicons color="#FFFFFF" name="play-outline" size={14} />
            <Text style={styles.resumeText}>Resume Subscription</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setIsPauseSheetOpen(true)} style={styles.secondaryButton}>
            <Ionicons color="#27231F" name="pause-outline" size={13} />
            <Text style={styles.secondaryText}>Pause Subscription</Text>
          </Pressable>
        )}

        <Pressable onPress={() => setIsPlanSheetOpen(true)} style={styles.secondaryButton}>
          <Ionicons color="#27231F" name={isInactive ? "grid-outline" : "arrow-up-outline"} size={13} />
          <Text style={styles.secondaryText}>{isInactive ? "View Plans" : "Upgrade Plan"}</Text>
        </Pressable>
      </ScrollView>

      <ChoosePlanSheet
        activePlan={pendingPlan}
        onClose={() => setIsPlanSheetOpen(false)}
        onConfirm={handleSubscribe}
        onSelect={setPendingPlan}
        plans={plans}
        visible={isPlanSheetOpen}
      />
      <PauseSubscriptionSheet
        onClose={() => setIsPauseSheetOpen(false)}
        onConfirm={(resumeDate) => {
          pause(resumeDate);
          setIsPauseSheetOpen(false);
        }}
        visible={isPauseSheetOpen}
      />
    </SafeAreaView>
  );
};

type ChoosePlanSheetProps = {
  activePlan: SubscriptionPlan;
  onClose: () => void;
  onConfirm: () => void;
  onSelect: (plan: SubscriptionPlan) => void;
  plans: SubscriptionPlan[];
  visible: boolean;
};

const ChoosePlanSheet = ({
  activePlan,
  onClose,
  onConfirm,
  onSelect,
  plans,
  visible,
}: ChoosePlanSheetProps) => (
  <Modal animationType="slide" transparent visible={visible}>
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons color="#FF4A17" name="close" size={15} />
        </Pressable>
        <Text style={styles.sheetTitle}>Choose a Plan</Text>
        <Text style={styles.sheetSubtitle}>Healthy meals. Delivered your way.</Text>
        <View style={styles.planList}>
          {plans.map((plan) => {
            const isSelected = activePlan.id === plan.id;
            return (
              <Pressable
                key={plan.id}
                onPress={() => onSelect(plan)}
                style={[styles.planOption, isSelected && styles.selectedPlanOption]}
              >
                <View style={styles.planOptionLeft}>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected ? <Ionicons color="#FFFFFF" name="checkmark" size={11} /> : null}
                  </View>
                  <View>
                    <Text style={styles.optionName}>{plan.name}</Text>
                    <Text style={styles.optionSummary}>{plan.summary}</Text>
                    <Text style={styles.optionSummary}>{plan.cadence}</Text>
                  </View>
                </View>
                <View style={styles.optionRight}>
                  {plan.badge ? <Text style={styles.popular}>{plan.badge}</Text> : null}
                  <Text style={styles.optionPrice}>{plan.price}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onConfirm} style={styles.subscribeBar}>
          <Text style={styles.subscribeBarText}>Subscribe Now</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

type PauseSubscriptionSheetProps = {
  onClose: () => void;
  onConfirm: (resumeDate: string) => void;
  visible: boolean;
};

const PauseSubscriptionSheet = ({
  onClose,
  onConfirm,
  visible,
}: PauseSubscriptionSheetProps) => {
  const options = useMemo(
    () => [
      {
        id: "3-days",
        resumeDate: "Jun 19, 2026",
        title: "3 days",
        subtitle: "Resume on Friday, Jun 19",
      },
      {
        id: "1-week",
        resumeDate: "Jun 23, 2026",
        title: "1 week",
        subtitle: "Resume on Tuesday, Jun 23",
      },
      {
        id: "2-weeks",
        resumeDate: "Jun 30, 2026",
        title: "2 weeks",
        subtitle: "Resume on Tuesday, Jun 30",
      },
    ],
    [],
  );
  const [selectedOptionId, setSelectedOptionId] = useState("1-week");
  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedOptionId) ?? options[0],
    [options, selectedOptionId],
  );

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.pauseSheet}>
          <Pressable onPress={onClose} style={styles.pauseCloseButton}>
            <Ionicons color="#837D77" name="close" size={14} />
          </Pressable>
          <View style={styles.pauseTitleRow}>
            <Ionicons color="#F0A000" name="pause-outline" size={16} />
            <Text style={styles.sheetTitle}>Pause Subscription</Text>
          </View>
          <Text style={styles.pauseDescription}>
            Your remaining meals will be preserved and deliveries will stop during the pause.
          </Text>
          <View style={styles.pauseOptions}>
            {options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              return (
              <Pressable
                key={option.id}
                onPress={() => setSelectedOptionId(option.id)}
                style={[styles.pauseOption, isSelected && styles.selectedPauseOption]}
              >
                <Text style={styles.pauseOptionTitle}>{option.title}</Text>
                <Text style={styles.pauseOptionSubtitle}>{option.subtitle}</Text>
              </Pressable>
              );
            })}
          </View>
          <Pressable
            onPress={() => onConfirm(selectedOption.resumeDate)}
            style={styles.confirmPauseButton}
          >
            <Text style={styles.confirmPauseText}>Confirm Pause</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  activeBadge: {
    backgroundColor: "#CFF8DF",
    borderColor: "#89E6AD",
  },
  activeBadgeText: {
    color: "#087A3B",
  },
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    height: 20,
    justifyContent: "center",
    marginBottom: 9,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  closeButton: {
    alignItems: "center",
    borderColor: "#FFB59E",
    borderRadius: 10,
    borderWidth: 1,
    height: 19,
    justifyContent: "center",
    position: "absolute",
    right: 6,
    top: 5,
    width: 19,
  },
  confirmPauseButton: {
    alignItems: "center",
    backgroundColor: "#E88700",
    borderRadius: 7,
    height: 33,
    justifyContent: "center",
    marginTop: 12,
  },
  confirmPauseText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  content: {
    paddingBottom: 28,
    paddingHorizontal: 8,
    paddingTop: 32,
  },
  optionName: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "800",
  },
  optionPrice: {
    color: "#FF4A17",
    fontSize: 14,
    fontWeight: "900",
  },
  optionRight: {
    alignItems: "flex-end",
    gap: 5,
  },
  optionSummary: {
    color: "#817B75",
    fontSize: 9,
    lineHeight: 13,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.76)",
    flex: 1,
    justifyContent: "flex-end",
  },
  pausedBadge: {
    backgroundColor: "#FFF0C9",
    borderColor: "#F0BE42",
  },
  pausedBadgeText: {
    color: "#9A6A00",
  },
  pausedCopy: {
    color: "#D77600",
    fontSize: 10,
    marginTop: 2,
  },
  pausedNotice: {
    alignItems: "center",
    backgroundColor: "#FFF8DD",
    borderColor: "#F3DE98",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    height: 57,
    marginTop: 13,
    paddingHorizontal: 28,
  },
  pausedTitle: {
    color: "#B46F00",
    fontSize: 12,
    fontWeight: "800",
  },
  pauseCloseButton: {
    position: "absolute",
    right: 11,
    top: 10,
    zIndex: 2,
  },
  pauseDescription: {
    color: "#817B75",
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 14,
  },
  pauseOption: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
    height: 55,
    justifyContent: "center",
    paddingHorizontal: 13,
  },
  selectedPauseOption: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FF4A17",
    borderWidth: 1,
  },
  pauseOptions: {
    gap: 8,
  },
  pauseOptionSubtitle: {
    color: "#8B8580",
    fontSize: 9,
    marginTop: 5,
  },
  pauseOptionTitle: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "800",
  },
  pauseSheet: {
    backgroundColor: "#FAF9F8",
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    paddingBottom: 10,
    paddingHorizontal: 13,
    paddingTop: 26,
  },
  pauseTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  planCard: {
    backgroundColor: "#FFF0E9",
    borderColor: "#FFCCBA",
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 20,
    padding: 19,
  },
  planHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 17,
  },
  planList: {
    gap: 8,
    marginBottom: 8,
    marginTop: 17,
  },
  planName: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "900",
  },
  planOption: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    height: 62,
    justifyContent: "space-between",
    paddingHorizontal: 11,
  },
  planOptionLeft: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 7,
  },
  popular: {
    backgroundColor: "#FF4A17",
    borderRadius: 7,
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  price: {
    color: "#FF4A17",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 20,
  },
  radio: {
    alignItems: "center",
    borderColor: "#FF4A17",
    borderRadius: 8,
    borderWidth: 1,
    height: 16,
    justifyContent: "center",
    marginTop: 2,
    width: 16,
  },
  radioSelected: {
    backgroundColor: "#FF4A17",
  },
  resumeButton: {
    alignItems: "center",
    backgroundColor: "#08A46B",
    borderRadius: 8,
    flexDirection: "row",
    gap: 7,
    height: 33,
    justifyContent: "center",
    marginTop: 16,
  },
  resumeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2DDD8",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    height: 31,
    justifyContent: "center",
    marginTop: 9,
  },
  secondaryText: {
    color: "#27231F",
    fontSize: 12,
    fontWeight: "800",
  },
  selectedPlanOption: {
    borderColor: "#FF4A17",
    borderWidth: 1,
  },
  sheet: {
    backgroundColor: "#FAF9F8",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 9,
    paddingHorizontal: 5,
    paddingTop: 26,
  },
  sheetSubtitle: {
    color: "#817B75",
    fontSize: 11,
    paddingHorizontal: 10,
  },
  sheetTitle: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 72,
    justifyContent: "center",
    paddingHorizontal: 13,
    width: "48%",
  },
  statLabel: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 3,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  statValue: {
    color: "#171513",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 7,
  },
  subscribeBar: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderRadius: 7,
    height: 33,
    justifyContent: "center",
  },
  subscribeBarText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  subtitle: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 2,
  },
  title: {
    color: "#171513",
    fontSize: 21,
    fontWeight: "900",
  },
});
