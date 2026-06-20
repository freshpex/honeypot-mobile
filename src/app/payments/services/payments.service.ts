import { apiClient } from "@/shared/api/client";
import type { SavedCard } from "@/shared/state";

export type PaymentHistoryItem = {
  amount: number;
  createdAt: string;
  deliveryFee: number;
  description: string;
  id: string;
  paymentMethod?: SavedCard | null;
  paymentMethodId?: string | null;
  reference: string;
  status: "PAID" | "PENDING" | "FAILED" | "CANCELLED";
};

export type AddPaymentMethodPayload = {
  expiry: string;
  holderName: string;
  number: string;
};

export type ChargePaymentPayload = {
  amount: number;
  callbackUrl?: string;
  deliveryFee: number;
  description: string;
  metadata?: Record<string, unknown>;
  paymentMethodId: string;
};

export type InitializePaymentResponse = {
  amount: number;
  authorizationUrl: string;
  id: string;
  provider: "paystack" | "flutterwave";
  reference: string;
  status: "PENDING" | "PAID" | "FAILED";
};

export const paymentsService = {
  module: "payments",
  listMethods: () => apiClient.get<SavedCard[]>("/payments/methods"),
  addMethod: (payload: AddPaymentMethodPayload) =>
    apiClient.post<SavedCard, AddPaymentMethodPayload>("/payments/methods", payload),
  deleteMethod: (methodId: string) =>
    apiClient.delete<{ message: string }>(`/payments/methods/${methodId}`),
  listHistory: () => apiClient.get<PaymentHistoryItem[]>("/payments/history"),
  initialize: (payload: ChargePaymentPayload) =>
    apiClient.post<InitializePaymentResponse, ChargePaymentPayload>("/payments/initialize", payload),
  verify: (reference: string) =>
    apiClient.post<PaymentHistoryItem, { reference: string }>("/payments/verify", { reference }),
};

