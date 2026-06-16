import { apiClient } from "@/shared/api/client";

export const mealsService = {
  module: "meals",
  getMenu: () => apiClient.get("/meals/menu"),
};

