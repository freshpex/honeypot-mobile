import { apiClient } from "@/shared/api/client";

export const profileService = {
  module: "profile",
  getProfile: () => apiClient.get("/profile/me"),
};

