import { apiClient } from "@/shared/api/client";
import type {
  CartResponse,
  CheckoutPayload,
  CustomerOrder,
  OrderListResponse,
  TrackingResponse,
} from "../types";

export const ordersService = {
  module: "orders",
  addCartItem: (mealId: string, quantity: number) =>
    apiClient.post<CartResponse, { mealId: string; quantity: number }>("/orders/cart/items", {
      mealId,
      quantity,
    }),
  clearCart: () => apiClient.delete<{ message: string }>("/orders/cart"),
  checkout: (payload: CheckoutPayload) =>
    apiClient.post<CustomerOrder, CheckoutPayload>("/orders/checkout", payload),
  getCart: () => apiClient.get<CartResponse>("/orders/cart"),
  getOrders: (status = "active", page = 1, limit = 10) =>
    apiClient.get<OrderListResponse>(`/orders?status=${status}&page=${page}&limit=${limit}`),
  getOrder: (orderId: string) => apiClient.get<CustomerOrder>(`/orders/${orderId}`),
  getTracking: (orderId: string) =>
    apiClient.get<TrackingResponse>(`/orders/${orderId}/tracking`),
  updateCartItem: (mealId: string, quantity: number) =>
    apiClient.patch<CartResponse, { quantity: number }>(`/orders/cart/items/${mealId}`, { quantity }),
};

