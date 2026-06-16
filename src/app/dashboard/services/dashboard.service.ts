import { apiClient } from "@/shared/api/client";

export const dashboardService = {
  module: "dashboard",
  getHome: () => apiClient.get("/dashboard/home"),
};

