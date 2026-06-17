export type SubscriptionsModuleName = "subscriptions";

export type SubscriptionPlanDto = {
  badge?: string;
  cadence: string;
  durationDays: number;
  id: string;
  meals: string;
  mealsPerDay: number;
  name: string;
  price: string;
  priceAmount: number;
  summary: string;
};

export type UserSubscriptionDto = {
  daysRemaining: number;
  endDate: string;
  expiresDate: string;
  id: string;
  pauseResumeDate?: string;
  plan: SubscriptionPlanDto;
  startDate: string;
  status: "active" | "paused" | "inactive";
};

export type SubscriptionOverviewDto = {
  current?: UserSubscriptionDto;
  plans: SubscriptionPlanDto[];
};

