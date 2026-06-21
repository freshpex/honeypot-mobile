import { apiClient } from "@/shared/api/client";

export type MealReview = {
  id: string;
  mealId: string;
  mealName: string;
  reviewer: string;
  rating: number;
  title: string;
  body: string;
  photoUrls: string[];
  status: "Pending" | "Published" | "Rejected";
  createdAt: string;
};

export type CommunityResponse = {
  reviews: MealReview[];
  leaderboard: { rank: number; name: string; points: number }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateReviewInput = {
  mealId: string;
  orderId?: string;
  rating: number;
  title: string;
  body: string;
  photoUrls?: string[];
};

export const communityService = {
  createReview: (body: CreateReviewInput) =>
    apiClient.post<MealReview, CreateReviewInput>("/community/reviews", body),
  getCommunity: (page = 1, limit = 10) =>
    apiClient.get<CommunityResponse>(`/community?page=${page}&limit=${limit}`),
  module: "community",
};

