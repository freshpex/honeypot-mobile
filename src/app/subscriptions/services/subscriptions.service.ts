import { apiClient } from "@/shared/api/client";

export const subscriptionsService = {
  module: "subscriptions",
  getCurrentSubscription: () => apiClient.get("/subscriptions/current"),
};

