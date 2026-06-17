import { apiClient } from "@/shared/api/client";
import type { CheckoutPayload, CustomerOrder, OrderListResponse, TrackingResponse } from "../types";

export const ordersService = {
  module: "orders",
  checkout: (payload: CheckoutPayload) =>
    apiClient.post<CustomerOrder, CheckoutPayload>("/orders/checkout", payload),
  getOrders: (status = "active", page = 1, limit = 10) =>
    apiClient.get<OrderListResponse>(`/orders?status=${status}&page=${page}&limit=${limit}`),
  getOrder: (orderId: string) => apiClient.get<CustomerOrder>(`/orders/${orderId}`),
  getTracking: (orderId: string) =>
    apiClient.get<TrackingResponse>(`/orders/${orderId}/tracking`),
};

