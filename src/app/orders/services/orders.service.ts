import { apiClient } from "@/shared/api/client";

export const ordersService = {
  module: "orders",
  getOrders: (status = "active") => apiClient.get(`/orders?status=${status}`),
};

