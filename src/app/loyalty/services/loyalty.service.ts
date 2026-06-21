import { apiClient } from "@/shared/api/client";

export type HoneyPointTransaction = {
  id: string;
  type: string;
  points: number;
  description: string;
  expiresAt?: string;
  createdAt: string;
};

export type LoyaltySummary = {
  balance: number;
  lifetimeEarned: number;
  tier: "Honey Bee" | "Gold Bee" | "Queen Bee";
  nextTier?: {
    name: "Gold Bee" | "Queen Bee";
    pointsRequired: number;
  };
  transactions: HoneyPointTransaction[];
  leaderboard: {
    rank: number;
    name: string;
    points: number;
  }[];
};

export const loyaltyService = {
  getSummary: (limit = 10) => apiClient.get<LoyaltySummary>(`/loyalty/summary?limit=${limit}`),
  module: "loyalty",
};

