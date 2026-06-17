import { apiClient } from "@/shared/api/client";
import type { DeliveryAddress } from "@/shared/state";

export type CreateDeliveryAddressPayload = Omit<DeliveryAddress, "id">;

export const profileService = {
  module: "profile",
  getProfile: () => apiClient.get("/profile/me"),
  listAddresses: () => apiClient.get<DeliveryAddress[]>("/profile/addresses"),
  createAddress: (payload: CreateDeliveryAddressPayload) =>
    apiClient.post<DeliveryAddress, CreateDeliveryAddressPayload>("/profile/addresses", payload),
  deleteAddress: (addressId: string) =>
    apiClient.delete<{ message: string }>(`/profile/addresses/${addressId}`),
};

