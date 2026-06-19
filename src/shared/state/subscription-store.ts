import { create } from "zustand";
import { subscriptionsService } from "@/app/subscriptions/services";
import type {
  SubscriptionOverviewDto,
  SubscriptionPlanDto,
  UserSubscriptionDto,
} from "@/app/subscriptions/types";

export type SubscriptionStatus = "active" | "paused" | "inactive";

export type SubscriptionPlan = {
  badge?: string;
  cadence: string;
  durationDays?: number;
  id: string;
  meals: string;
  mealsPerDay?: number;
  name: string;
  price: string;
  priceAmount?: number;
  summary: string;
};

type SubscriptionState = {
  daysRemaining: number;
  endDate: string;
  error?: string;
  expiresDate: string;
  isLoading: boolean;
  pauseResumeDate: string;
  plans: SubscriptionPlan[];
  selectedPlan?: SubscriptionPlan;
  startDate: string;
  status: SubscriptionStatus;
  load: () => Promise<void>;
  pause: (durationDays?: number) => Promise<void>;
  resume: () => Promise<void>;
  subscribe: (plan: SubscriptionPlan, paymentReference: string) => Promise<void>;
};

type SubscriptionSet = (partial: Partial<SubscriptionState>) => void;

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  daysRemaining: 0,
  endDate: "",
  expiresDate: "",
  isLoading: false,
  pauseResumeDate: "",
  plans: [],
  selectedPlan: undefined,
  startDate: "",
  status: "inactive",
  load: async () => {
    set({ error: undefined, isLoading: true });
    try {
      applyOverview(await subscriptionsService.getOverview(), set);
    } catch (error) {
      set({ error: messageFromError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  pause: async (durationDays = 7) => {
    set({ error: undefined, isLoading: true });
    try {
      applySubscription(await subscriptionsService.pause(durationDays), set, get().plans);
    } catch (error) {
      set({ error: messageFromError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  resume: async () => {
    set({ error: undefined, isLoading: true });
    try {
      applySubscription(await subscriptionsService.resume(), set, get().plans);
    } catch (error) {
      set({ error: messageFromError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  subscribe: async (plan, paymentReference) => {
    set({ error: undefined, isLoading: true });
    try {
      const current = get().status === "inactive"
        ? await subscriptionsService.subscribe(plan.id, paymentReference)
        : await subscriptionsService.upgrade(plan.id, paymentReference);
      applySubscription(current, set, get().plans);
    } catch (error) {
      set({ error: messageFromError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
}));

const applyOverview = (
  overview: SubscriptionOverviewDto,
  set: SubscriptionSet,
) => {
  const plans = overview.plans.map(planFromDto);
  if (!overview.current) {
    set({
      daysRemaining: 0,
      endDate: "",
      expiresDate: "",
      pauseResumeDate: "",
      plans,
      selectedPlan: undefined,
      startDate: "",
      status: "inactive",
    });
    return;
  }
  applySubscription(overview.current, set, plans);
};

const applySubscription = (
  subscription: UserSubscriptionDto,
  set: SubscriptionSet,
  plans: SubscriptionPlan[],
) => {
  const selectedPlan = planFromDto(subscription.plan);
  set({
    daysRemaining: subscription.daysRemaining,
    endDate: formatDate(subscription.endDate),
    expiresDate: formatDate(subscription.expiresDate),
    pauseResumeDate: subscription.pauseResumeDate ? formatDate(subscription.pauseResumeDate) : "",
    plans,
    selectedPlan,
    startDate: formatDate(subscription.startDate),
    status: subscription.status,
  });
};

const planFromDto = (plan: SubscriptionPlanDto): SubscriptionPlan => ({
  badge: plan.badge,
  cadence: plan.cadence,
  durationDays: plan.durationDays,
  id: plan.id,
  meals: plan.meals,
  mealsPerDay: plan.mealsPerDay,
  name: plan.name,
  price: plan.price,
  priceAmount: plan.priceAmount,
  summary: plan.summary,
});

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const messageFromError = (error: unknown) =>
  error instanceof Error ? error.message : "Subscription service is unavailable.";
