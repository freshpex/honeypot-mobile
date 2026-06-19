import { apiClient } from "@/shared/api/client";

export type HealthGoal = {
  calorieTarget: number;
  proteinGoal: number;
  macroProtein: number;
  macroCarbs: number;
  macroFat: number;
  primaryGoal: string;
};

export type RecommendedMeal = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
  calories: number;
  protein: number;
  tags: string[];
  why: string[];
};

export type PersonalizationProfile = {
  healthGoal: HealthGoal | null;
  recommendations: RecommendedMeal[];
};

export const personalizationService = {
  getProfile: () => apiClient.get<PersonalizationProfile>("/personalization/profile"),
  module: "personalization",
  updateHealthGoal: (body: HealthGoal) =>
    apiClient.put<PersonalizationProfile, HealthGoal>("/personalization/health-goal", body),
};

