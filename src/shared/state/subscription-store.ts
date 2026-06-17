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

const fallbackPlans: SubscriptionPlan[] = [
  {
    cadence: "21 meals · 3/day",
    durationDays: 7,
    id: "basic",
    meals: "21",
    mealsPerDay: 3,
    name: "Basic",
    price: "₦25,000",
    priceAmount: 25000,
    summary: "1 week of meals",
  },
  {
    badge: "POPULAR",
    cadence: "60 meals · 2/day",
    durationDays: 30,
    id: "standard",
    meals: "60",
    mealsPerDay: 2,
    name: "Standard",
    price: "₦65,000",
    priceAmount: 65000,
    summary: "1 month, 2 meals/day",
  },
  {
    cadence: "90 meals · 3/day",
    durationDays: 30,
    id: "premium",
    meals: "90",
    mealsPerDay: 3,
    name: "Premium",
    price: "₦90,000",
    priceAmount: 90000,
    summary: "1 month, 3 meals/day",
  },
  {
    cadence: "180 meals · 6/day",
    durationDays: 30,
    id: "family",
    meals: "180",
    mealsPerDay: 6,
    name: "Family",
    price: "₦160,000",
    priceAmount: 160000,
    summary: "1 month, family of 2",
  },
];

type SubscriptionState = {
  daysRemaining: number;
  endDate: string;
  error?: string;
  expiresDate: string;
  isLoading: boolean;
  pauseResumeDate: string;
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan;
  startDate: string;
  status: SubscriptionStatus;
  load: () => Promise<void>;
  pause: (durationDays?: number) => Promise<void>;
  resume: () => Promise<void>;
  subscribe: (plan: SubscriptionPlan) => Promise<void>;
};

type SubscriptionSet = (partial: Partial<SubscriptionState>) => void;

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  daysRemaining: 0,
  endDate: "",
  expiresDate: "",
  isLoading: false,
  pauseResumeDate: "",
  plans: fallbackPlans,
  selectedPlan: fallbackPlans[0],
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
  subscribe: async (plan) => {
    set({ error: undefined, isLoading: true });
    try {
      const current = get().status === "inactive"
        ? await subscriptionsService.subscribe(plan.id)
        : await subscriptionsService.upgrade(plan.id);
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
      selectedPlan: plans[0] ?? fallbackPlans[0],
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
    plans: plans.length ? plans : fallbackPlans,
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
