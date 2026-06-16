import { create } from "zustand";

export type SubscriptionStatus = "active" | "paused" | "inactive";

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: string;
  summary: string;
  cadence: string;
  meals: string;
  badge?: string;
};

const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "₦25,000",
    summary: "1 week of meals",
    cadence: "21 meals · 3/day",
    meals: "21",
  },
  {
    id: "standard",
    name: "Standard",
    price: "₦65,000",
    summary: "1 month, 2 meals/day",
    cadence: "60 meals · 2/day",
    meals: "60",
    badge: "POPULAR",
  },
  {
    id: "premium",
    name: "Premium",
    price: "₦90,000",
    summary: "1 month, 3 meals/day",
    cadence: "90 meals · 3/day",
    meals: "90",
  },
  {
    id: "family",
    name: "Family",
    price: "₦160,000",
    summary: "1 month, family of 2",
    cadence: "180 meals · 6/day",
    meals: "180",
  },
];

type SubscriptionState = {
  daysRemaining: number;
  endDate: string;
  expiresDate: string;
  pauseResumeDate: string;
  plans: SubscriptionPlan[];
  selectedPlan: SubscriptionPlan;
  startDate: string;
  status: SubscriptionStatus;
  pause: (resumeDate?: string) => void;
  resume: () => void;
  subscribe: (plan: SubscriptionPlan) => void;
};

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  daysRemaining: 6,
  endDate: "Jun 22, 2026",
  expiresDate: "Jun 22, 2026",
  pauseResumeDate: "Jun 22, 2026",
  plans,
  selectedPlan: plans[0],
  startDate: "Jun 15, 2026",
  status: "active",
  pause: (resumeDate) =>
    set((state) => ({
      pauseResumeDate: resumeDate ?? state.pauseResumeDate,
      status: "paused",
    })),
  resume: () => set({ status: "active" }),
  subscribe: (plan) =>
    set({
      daysRemaining: 6,
      selectedPlan: plan,
      status: "active",
    }),
}));
