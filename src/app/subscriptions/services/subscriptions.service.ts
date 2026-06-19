import { apiClient } from "@/shared/api/client";
import type {
  GiftSubscriptionDto,
  GiftSubscriptionInput,
  SubscriptionOverviewDto,
  SubscriptionPlanDto,
  UserSubscriptionDto,
} from "../types";

export const subscriptionsService = {
  module: "subscriptions",
  getPlans: () => apiClient.get<SubscriptionPlanDto[]>("/subscriptions/plans"),
  getOverview: () => apiClient.get<SubscriptionOverviewDto>("/subscriptions"),
  getCurrentSubscription: () => apiClient.get<UserSubscriptionDto | undefined>("/subscriptions/current"),
  subscribe: (planId: string, paymentReference: string) =>
    apiClient.post<UserSubscriptionDto, { paymentReference: string; planId: string }>(
      "/subscriptions/subscribe",
      { paymentReference, planId },
    ),
  upgrade: (planId: string, paymentReference: string) =>
    apiClient.patch<UserSubscriptionDto, { paymentReference: string; planId: string }>(
      "/subscriptions/upgrade",
      { paymentReference, planId },
    ),
  pause: (durationDays: number, reason?: string) =>
    apiClient.post<UserSubscriptionDto, { durationDays: number; reason?: string }>(
      "/subscriptions/pause",
      { durationDays, reason },
    ),
  resume: () => apiClient.post<UserSubscriptionDto, Record<string, never>>("/subscriptions/resume", {}),
  gift: (input: GiftSubscriptionInput) =>
    apiClient.post<GiftSubscriptionDto, GiftSubscriptionInput>("/subscriptions/gift", input),
};

