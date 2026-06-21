import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  type SavedCard,
  type SubscriptionPlan,
  useCustomerStore,
  useSubscriptionStore,
} from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import { paymentsService } from "@/app/payments/services";

export const SubscriptionsScreen = () => {
  const {
    daysRemaining,
    endDate,
    error,
    isLoading,
    load,
    pause,
    pauseResumeDate,
    plans,
    resume,
    selectedPlan,
    startDate,
    status,
    subscribe,
  } = useSubscriptionStore();
  const cards = useCustomerStore((state) => state.cards);
  const loadCards = useCustomerStore((state) => state.loadCards);
  const [isPlanSheetOpen, setIsPlanSheetOpen] = useState(false);
  const [isPauseSheetOpen, setIsPauseSheetOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | undefined>(selectedPlan);
  const [paymentError, setPaymentError] = useState<string>();
  const [selectedCardId, setSelectedCardId] = useState<string>();

  const isPaused = status === "paused";
  const isInactive = status === "inactive";

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void loadCards();
  }, [loadCards]);

  const effectivePendingPlan = useMemo(
    () => pendingPlan ?? selectedPlan ?? plans[0],
    [pendingPlan, plans, selectedPlan],
  );
  const effectiveSelectedCardId = useMemo(
    () => (selectedCardId && cards.some((card) => card.id === selectedCardId) ? selectedCardId : cards[0]?.id),
    [cards, selectedCardId],
  );
  const selectedCard = useMemo(
    () => cards.find((card) => card.id === effectiveSelectedCardId),
    [cards, effectiveSelectedCardId],
  );

  const stats = useMemo(
    () => [
      {
        icon: "flame-outline",
        label: "Meals remaining",
        value: selectedPlan?.meals ?? "0",
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
    ] satisfies {
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      value: string;
    }[],
    [daysRemaining, endDate, selectedPlan?.meals, startDate],
  );

  const handleSubscribe = async () => {
    if (!effectivePendingPlan || !selectedCard) {
      setPaymentError("Add or select a payment card before subscribing.");
      return;
    }
    setPaymentError(undefined);
    setIsPaymentProcessing(true);
    try {
      const callbackUrl = Linking.createURL("payment-complete");
      const initialized = await paymentsService.initialize({
        amount: effectivePendingPlan.priceAmount ?? 0,
        callbackUrl,
        deliveryFee: 0,
        description: `${effectivePendingPlan.name} Plan`,
        metadata: { kind: "subscription", planId: effectivePendingPlan.id },
        paymentMethodId: selectedCard.id,
      });
      const paymentResult = await WebBrowser.openAuthSessionAsync(initialized.authorizationUrl, callbackUrl);
      if (paymentResult.type === "cancel" || paymentResult.type === "dismiss") {
        setPaymentError("Payment was cancelled before completion.");
        return;
      }
      const verified = await paymentsService.verify(initialized.reference);
      if (verified.status !== "PAID") {
        setPaymentError("Payment was not completed. Please retry or choose another card.");
        return;
      }
      await subscribe(effectivePendingPlan, verified.reference);
    } catch (caughtError) {
      setPaymentError(caughtError instanceof Error ? caughtError.message : "Unable to complete payment.");
      return;
    } finally {
      setIsPaymentProcessing(false);
    }
    setIsPlanSheetOpen(false);
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isInactive ? (
          <View style={styles.emptyPlanCard}>
            <Ionicons color={resolveThemeColor("#C9C5C1")} name="calendar-outline" size={34} />
            <Text style={styles.emptyPlanTitle}>No active plan</Text>
            <Text style={styles.emptyPlanCopy}>Choose a meal plan to start healthy deliveries.</Text>
            <Pressable
              onPress={() => {
                setPendingPlan(plans[0]);
                setIsPlanSheetOpen(true);
              }}
              style={styles.viewPlansButton}
            >
              <Text style={styles.viewPlansText}>View Plans</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <View>
                <View style={[styles.badge, isPaused ? styles.pausedBadge : styles.activeBadge]}>
                  <Text style={[styles.badgeText, isPaused ? styles.pausedBadgeText : styles.activeBadgeText]}>
                    {isPaused ? "Paused" : "Active"}
                  </Text>
                </View>
                <Text style={styles.planName}>{selectedPlan ? `${selectedPlan.name} Plan` : "Plan"}</Text>
              </View>
              <Text style={styles.price}>{selectedPlan?.price ?? ""}</Text>
            </View>

            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.statCard}>
                  <Ionicons color={resolveThemeColor("#FF4A17")} name={stat.icon} size={18} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {isPaused ? (
              <View style={styles.pausedNotice}>
                <Ionicons color={resolveThemeColor("#F0A000")} name="pause-outline" size={17} />
                <View>
                  <Text style={styles.pausedTitle}>Subscription Paused</Text>
                  <Text style={styles.pausedCopy}>Resumes on {pauseResumeDate}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}

        {isPaused ? (
          <Pressable onPress={resume} style={styles.resumeButton}>
            <Ionicons color={resolveThemeColor("#FFFFFF")} name="play-outline" size={14} />
            <Text style={styles.resumeText}>Resume Subscription</Text>
          </Pressable>
        ) : isInactive ? null : (
          <Pressable onPress={() => setIsPauseSheetOpen(true)} style={styles.secondaryButton}>
            <Ionicons color={resolveThemeColor("#27231F")} name="pause-outline" size={13} />
            <Text style={styles.secondaryText}>Pause Subscription</Text>
          </Pressable>
        )}

        {!isInactive ? (
          <Pressable
            onPress={() => {
              setPendingPlan(selectedPlan ?? plans[0]);
              setIsPlanSheetOpen(true);
            }}
            style={styles.secondaryButton}
          >
            <Ionicons color={resolveThemeColor("#27231F")} name="arrow-up-outline" size={13} />
            <Text style={styles.secondaryText}>Upgrade Plan</Text>
          </Pressable>
        ) : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>

      <ChoosePlanSheet
        activePlan={effectivePendingPlan}
        activeCardId={effectiveSelectedCardId}
        cards={cards}
        isLoading={isLoading || isPaymentProcessing}
        onClose={() => setIsPlanSheetOpen(false)}
        onConfirm={handleSubscribe}
        onSelectCard={setSelectedCardId}
        onSelect={setPendingPlan}
        paymentError={paymentError}
        plans={plans}
        visible={isPlanSheetOpen}
      />
      <PauseSubscriptionSheet
        onClose={() => setIsPauseSheetOpen(false)}
        onConfirm={(durationDays) => {
          void pause(durationDays);
          setIsPauseSheetOpen(false);
        }}
        visible={isPauseSheetOpen}
      />
    </SafeAreaView>
  );
};

type ChoosePlanSheetProps = {
  activePlan?: SubscriptionPlan;
  activeCardId?: string;
  cards: SavedCard[];
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  onSelectCard: (cardId: string) => void;
  onSelect: (plan: SubscriptionPlan) => void;
  paymentError?: string;
  plans: SubscriptionPlan[];
  visible: boolean;
};

const ChoosePlanSheet = ({
  activePlan,
  activeCardId,
  cards,
  isLoading,
  onClose,
  onConfirm,
  onSelectCard,
  onSelect,
  paymentError,
  plans,
  visible,
}: ChoosePlanSheetProps) => (
  <ChoosePlanSheetContent
    activePlan={activePlan}
    activeCardId={activeCardId}
    cards={cards}
    isLoading={isLoading}
    onClose={onClose}
    onConfirm={onConfirm}
    onSelectCard={onSelectCard}
    onSelect={onSelect}
    paymentError={paymentError}
    plans={plans}
    visible={visible}
  />
);

const ChoosePlanSheetContent = ({
  activePlan,
  activeCardId,
  cards,
  isLoading,
  onClose,
  onConfirm,
  onSelectCard,
  onSelect,
  paymentError,
  plans,
  visible,
}: ChoosePlanSheetProps) => {
  const insets = useSafeAreaInsets();

  return (
  <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
    <View style={styles.overlay}>
      <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name="close" size={15} />
        </Pressable>
        <Text style={styles.sheetTitle}>Choose a Plan</Text>
        <Text style={styles.sheetSubtitle}>Healthy meals. Delivered your way.</Text>
        <View style={styles.planList}>
          {plans.map((plan) => {
            const isSelected = activePlan?.id === plan.id;
            return (
              <Pressable
                key={plan.id}
                onPress={() => onSelect(plan)}
                style={[styles.planOption, isSelected && styles.selectedPlanOption]}
              >
                <View style={styles.planOptionLeft}>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected ? <Ionicons color={resolveThemeColor("#FFFFFF")} name="checkmark" size={11} /> : null}
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
        <Text style={styles.paymentSelectTitle}>Pay with</Text>
        <View style={styles.cardList}>
          {cards.length ? (
            cards.map((card) => {
              const isSelected = activeCardId === card.id;
              return (
                <Pressable
                  key={card.id}
                  onPress={() => onSelectCard(card.id)}
                  style={[styles.cardOption, isSelected && styles.selectedPlanOption]}
                >
                  <Ionicons color={resolveThemeColor("#34A8F4")} name="card-outline" size={16} />
                  <View style={styles.cardOptionTextWrap}>
                    <Text style={styles.cardOptionTitle}>{card.brand} •••• {card.last4}</Text>
                    <Text style={styles.cardOptionSubtitle}>Expires {card.expiry}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected ? <Ionicons color={resolveThemeColor("#FFFFFF")} name="checkmark" size={11} /> : null}
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View style={styles.noCardNotice}>
              <Text style={styles.noCardText}>Add a payment card in Profile before subscribing.</Text>
            </View>
          )}
        </View>
        {paymentError ? <Text style={styles.errorText}>{paymentError}</Text> : null}
        <Pressable
          disabled={isLoading || !activePlan || !activeCardId}
          onPress={onConfirm}
          style={[styles.subscribeBar, (isLoading || !activePlan || !activeCardId) && styles.disabledButton]}
        >
          <Text style={styles.subscribeBarText}>{isLoading ? "Processing payment..." : "Subscribe Now"}</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
  );
};

type PauseSubscriptionSheetProps = {
  onClose: () => void;
  onConfirm: (durationDays: number) => void;
  visible: boolean;
};

const PauseSubscriptionSheet = ({
  onClose,
  onConfirm,
  visible,
}: PauseSubscriptionSheetProps) => {
  const insets = useSafeAreaInsets();
  const options = useMemo(
    () => [
      {
        id: "3-days",
        durationDays: 3,
        title: "3 days",
        subtitle: "Resume on Friday, Jun 19",
      },
      {
        id: "1-week",
        durationDays: 7,
        title: "1 week",
        subtitle: "Resume on Tuesday, Jun 23",
      },
      {
        id: "2-weeks",
        durationDays: 14,
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
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        <View style={[styles.pauseSheet, { paddingBottom: Math.max(insets.bottom + 12, 24) }]}>
          <Pressable onPress={onClose} style={styles.pauseCloseButton}>
            <Ionicons color={resolveThemeColor("#837D77")} name="close" size={14} />
          </Pressable>
          <View style={styles.pauseTitleRow}>
            <Ionicons color={resolveThemeColor("#F0A000")} name="pause-outline" size={16} />
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
            onPress={() => onConfirm(selectedOption.durationDays)}
            style={styles.confirmPauseButton}
          >
            <Text style={styles.confirmPauseText}>Confirm Pause</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = createThemedStyleSheet({
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
    borderColor: "#FFC266",
    borderTopWidth: 1,
    elevation: 6,
    height: 33,
    justifyContent: "center",
    marginTop: 12,
    ...skeuo.action,
  },
  confirmPauseText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  cardList: {
    gap: 7,
    marginBottom: 10,
  },
  cardOption: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 3,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: 11,
    ...skeuo.card,
  },
  cardOptionSubtitle: {
    color: "#817B75",
    fontSize: 9,
    marginTop: 2,
  },
  cardOptionTextWrap: {
    flex: 1,
    marginLeft: 9,
  },
  cardOptionTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  content: {
    paddingBottom: 28,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  disabledButton: {
    opacity: 0.55,
  },
  emptyPlanCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 11,
    borderTopWidth: 1,
    elevation: 5,
    justifyContent: "center",
    marginTop: 20,
    minHeight: 155,
    paddingHorizontal: 18,
    ...skeuo.card,
  },
  emptyPlanCopy: {
    color: "#817B75",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    textAlign: "center",
  },
  emptyPlanTitle: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
    marginTop: 10,
  },
  errorText: {
    color: "#C8320D",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    marginTop: 12,
    textAlign: "center",
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
    elevation: 3,
    flexDirection: "row",
    gap: 12,
    height: 57,
    marginTop: 13,
    paddingHorizontal: 28,
    ...skeuo.card,
  },
  pausedTitle: {
    color: "#B46F00",
    fontSize: 12,
    fontWeight: "800",
  },
  noCardNotice: {
    backgroundColor: "#FFF8DD",
    borderColor: "#F3DE98",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  noCardText: {
    color: "#9A6A00",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
  },
  paymentSelectTitle: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 7,
    marginTop: 5,
    paddingHorizontal: 7,
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
    elevation: 3,
    height: 55,
    justifyContent: "center",
    paddingHorizontal: 13,
    ...skeuo.card,
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
    elevation: 14,
    paddingBottom: 10,
    paddingHorizontal: 13,
    paddingTop: 26,
    ...skeuo.floating,
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
    elevation: 7,
    marginTop: 20,
    padding: 19,
    ...skeuo.deepCard,
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
    elevation: 3,
    flexDirection: "row",
    height: 62,
    justifyContent: "space-between",
    paddingHorizontal: 11,
    ...skeuo.card,
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
    borderColor: "#57D9A4",
    borderTopWidth: 1,
    elevation: 6,
    flexDirection: "row",
    gap: 7,
    height: 33,
    justifyContent: "center",
    marginTop: 16,
    ...skeuo.action,
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
    elevation: 3,
    flexDirection: "row",
    gap: 8,
    height: 31,
    justifyContent: "center",
    marginTop: 9,
    ...skeuo.card,
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
    elevation: 14,
    paddingBottom: 9,
    paddingHorizontal: 5,
    paddingTop: 26,
    ...skeuo.floating,
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
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 3,
    height: 72,
    justifyContent: "center",
    paddingHorizontal: 13,
    width: "48%",
    ...skeuo.card,
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
    borderColor: "#FF8B68",
    borderTopWidth: 1,
    elevation: 6,
    height: 33,
    justifyContent: "center",
    ...skeuo.action,
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
  viewPlansButton: {
    alignItems: "center",
    backgroundColor: "#FF4A17",
    borderColor: "#FF8B68",
    borderRadius: 8,
    borderTopWidth: 1,
    elevation: 6,
    height: 34,
    justifyContent: "center",
    marginTop: 15,
    minWidth: 150,
    ...skeuo.action,
  },
  viewPlansText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
});
