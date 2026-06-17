import { apiClient } from "@/shared/api/client";

export type ReferralChannel = "WhatsApp" | "SMS" | "Email";

export type ReferralDetails = {
  code: string;
  id: string;
  rewardAmount: number;
  shareCount: number;
};

export const referralsService = {
  module: "referrals",
  getMine: () => apiClient.get<ReferralDetails>("/referrals/me"),
  share: (channel: ReferralChannel) =>
    apiClient.post<ReferralDetails, { channel: ReferralChannel }>("/referrals/share", { channel }),
};

