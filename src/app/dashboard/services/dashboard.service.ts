import { apiClient } from "@/shared/api/client";
import type { CustomerOrder } from "@/app/orders/types";
import type { UserSubscriptionDto } from "@/app/subscriptions/types";

export type DashboardHomeResponse = {
  greetingName: string;
  subscription?: UserSubscriptionDto;
  quickStats: {
    activeOrders: number;
    deliveredOrders: number;
    totalSpent: number;
    upcomingDeliveries: number;
  };
  upcomingDeliveries: CustomerOrder[];
};

export const dashboardService = {
  module: "dashboard",
  getHome: () => apiClient.get<DashboardHomeResponse>("/dashboard/home"),
};

