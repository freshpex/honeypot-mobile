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

export type GiftSubscriptionDto = {
  code: string;
  design?: string;
  expiresAt: string;
  id: string;
  message?: string;
  plan: SubscriptionPlanDto;
  recipientEmail: string;
  recipientName: string;
  sendAt?: string;
  status: "scheduled" | "sent" | "redeemed" | "expired";
};

export type GiftSubscriptionInput = {
  planId: string;
  recipientName: string;
  recipientEmail: string;
  message?: string;
  design?: string;
  sendAt?: string;
};

