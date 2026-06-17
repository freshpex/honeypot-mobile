import { apiClient } from "@/shared/api/client";
import type { SavedCard } from "@/shared/state";

export type PaymentHistoryItem = {
  amount: number;
  createdAt: string;
  deliveryFee: number;
  description: string;
  id: string;
  paymentMethod?: SavedCard | null;
  paymentMethodId: string;
  reference: string;
  status: "PAID" | "PENDING" | "FAILED";
};

export type AddPaymentMethodPayload = {
  expiry: string;
  holderName: string;
  number: string;
};

export type ChargePaymentPayload = {
  amount: number;
  deliveryFee: number;
  description: string;
  metadata?: Record<string, unknown>;
  paymentMethodId: string;
};

export const paymentsService = {
  module: "payments",
  listMethods: () => apiClient.get<SavedCard[]>("/payments/methods"),
  addMethod: (payload: AddPaymentMethodPayload) =>
    apiClient.post<SavedCard, AddPaymentMethodPayload>("/payments/methods", payload),
  deleteMethod: (methodId: string) =>
    apiClient.delete<{ message: string }>(`/payments/methods/${methodId}`),
  listHistory: () => apiClient.get<PaymentHistoryItem[]>("/payments/history"),
  charge: (payload: ChargePaymentPayload) =>
    apiClient.post<PaymentHistoryItem, ChargePaymentPayload>("/payments/charge", payload),
};

