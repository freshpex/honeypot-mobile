import { apiClient } from "@/shared/api/client";
import type { Meal, MealDetail, MealReviewEntry } from "../types";

export type MealsMenuResponse = {
  meals: Meal[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type MealsMenuParams = {
  category?: string;
  limit?: number;
  page?: number;
  q?: string;
  sort?: "name_asc" | "price_asc" | "price_desc" | "rating_desc" | "newest";
  tag?: string;
};

export type MealFiltersResponse = {
  categories: string[];
  tags: string[];
};

export type MealReviewsResponse = {
  reviews: MealReviewEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateMealReviewPayload = {
  body: string;
  orderId?: string;
  photoUrls?: string[];
  rating: number;
  title: string;
};

export type WeeklyMealSelection = {
  date: string;
  dayLabel: string;
  status: "Selected" | "Skipped" | "Auto Assigned" | "Locked" | "Unselected";
  cutoffAt: string;
  locked: boolean;
  meal?: Meal;
};

export const mealsService = {
  module: "meals",
  getMenu: (params: MealsMenuParams = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        search.set(key, String(value));
      }
    });
    const query = search.toString();
    return apiClient.get<MealsMenuResponse>(`/meals/menu${query ? `?${query}` : ""}`);
  },
  getFilters: () => apiClient.get<MealFiltersResponse>("/meals/filters"),
  getMeal: (mealId: string) => apiClient.get<MealDetail>(`/meals/${mealId}`),
  getReviews: (mealId: string, page = 1, limit = 10) =>
    apiClient.get<MealReviewsResponse>(`/meals/${mealId}/reviews?page=${page}&limit=${limit}`),
  createReview: (mealId: string, payload: CreateMealReviewPayload) =>
    apiClient.post<MealReviewEntry, CreateMealReviewPayload>(`/meals/${mealId}/reviews`, payload),
  getWeeklySelections: (weekStart?: string) =>
    apiClient.get<WeeklyMealSelection[]>(
      `/meals/selections/week${weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : ""}`,
    ),
  selectMeal: (deliveryDate: string, mealId: string) =>
    apiClient.put<WeeklyMealSelection, { date: string; mealId: string }>(
      "/meals/selections",
      { date: deliveryDate, mealId },
    ),
  skipMeal: (deliveryDate: string, reason?: string) =>
    apiClient.post<WeeklyMealSelection, { date: string; reason?: string }>(
      "/meals/selections/skip",
      { date: deliveryDate, reason },
    ),
};

