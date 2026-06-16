import { apiClient } from "@/shared/api/client";
import type { Meal } from "../types";

export type MealsMenuResponse = {
  meals: Meal[];
};

export const mealsService = {
  module: "meals",
  getMenu: () => apiClient.get<MealsMenuResponse>("/meals/menu"),
};

