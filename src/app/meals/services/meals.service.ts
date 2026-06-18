import { apiClient } from "@/shared/api/client";
import type { Meal } from "../types";

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
  tag?: string;
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
  getWeeklySelections: (weekStart?: string) =>
    apiClient.get<WeeklyMealSelection[]>(
      `/meals/selections/week${weekStart ? `?weekStart=${encodeURIComponent(weekStart)}` : ""}`,
    ),
  selectMeal: (deliveryDate: string, mealId: string) =>
    apiClient.put<WeeklyMealSelection, { deliveryDate: string; mealId: string }>(
      "/meals/selections",
      { deliveryDate, mealId },
    ),
  skipMeal: (deliveryDate: string, reason?: string) =>
    apiClient.post<WeeklyMealSelection, { deliveryDate: string; reason?: string }>(
      "/meals/selections/skip",
      { deliveryDate, reason },
    ),
};

