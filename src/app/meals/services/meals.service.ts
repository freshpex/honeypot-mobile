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
};

