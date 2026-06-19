import { apiClient } from "@/shared/api/client";
import type {
  AdminLog,
  AdminMeal,
  AdminMealStatus,
  AdminOrder,
  AdminOrderStatus,
  AdminSettings,
  AdminUser,
  AdminUserStatus,
} from "@/shared/state";

export type AdminOverview = {
  metrics: {
    activeOrders: number;
    availableMeals: number;
    deliveredOrders: number;
    hiddenMeals: number;
    revenue: number;
    suspendedUsers: number;
    totalMeals: number;
    totalOrders: number;
    totalUsers: number;
  };
  recentLogs: AdminLog[];
};

export type AdminPaginated<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AdminMealPayload = Omit<AdminMeal, "id" | "slug">;
export type MealImageUploadResponse = {
  publicId: string;
  url: string;
};

const mealStatusCode: Record<AdminMealStatus, string> = {
  Available: "AVAILABLE",
  Hidden: "HIDDEN",
  "Sold Out": "SOLD_OUT",
};

const userStatusCode: Record<AdminUserStatus, string> = {
  Active: "ACTIVE",
  Paused: "ACTIVE",
  Suspended: "SUSPENDED",
};

const orderStatusCode: Record<AdminOrderStatus, string> = {
  Cancelled: "CANCELLED",
  Confirmed: "CONFIRMED",
  Delivered: "DELIVERED",
  "Out for Delivery": "OUT_FOR_DELIVERY",
  Preparing: "PREPARING",
};

export const adminService = {
  overview: () => apiClient.get<AdminOverview>("/admin/overview"),
  users: (page = 1, limit = 100) =>
    apiClient.get<AdminPaginated<AdminUser>>(`/admin/users?page=${page}&limit=${limit}`),
  updateUserStatus: (userId: string, status: AdminUserStatus) =>
    apiClient.patch<AdminUser, { status: string }>(`/admin/users/${userId}/status`, {
      status: userStatusCode[status],
    }),
  meals: (page = 1, limit = 100) =>
    apiClient.get<AdminPaginated<AdminMeal>>(`/admin/meals?page=${page}&limit=${limit}`),
  createMeal: (payload: AdminMealPayload) =>
    apiClient.post<AdminMeal, Record<string, unknown>>("/admin/meals", mealPayload(payload)),
  updateMeal: (mealId: string, payload: Partial<AdminMealPayload>) =>
    apiClient.patch<AdminMeal, Record<string, unknown>>(
      `/admin/meals/${mealId}`,
      mealPayload(payload),
    ),
  uploadMealImage: (payload: { base64: string; fileName?: string; mimeType: string }) =>
    apiClient.post<MealImageUploadResponse, typeof payload>("/admin/meals/upload-image", payload),
  deleteMeal: (mealId: string) => apiClient.delete<AdminMeal>(`/admin/meals/${mealId}`),
  orders: (page = 1, limit = 100) =>
    apiClient.get<AdminPaginated<AdminOrder>>(`/admin/orders?page=${page}&limit=${limit}`),
  updateOrderStatus: (orderId: string, status: AdminOrderStatus) =>
    apiClient.patch<AdminOrder, { status: string }>(`/admin/orders/${orderId}/status`, {
      status: orderStatusCode[status],
    }),
  logs: (page = 1, limit = 100) =>
    apiClient.get<AdminPaginated<AdminLog>>(`/admin/logs?page=${page}&limit=${limit}`),
  settings: () => apiClient.get<AdminSettings>("/admin/settings"),
  updateSetting: (key: keyof AdminSettings, value: boolean) =>
    apiClient.patch<AdminSettings, { value: boolean }>(`/admin/settings/${key}`, { value }),
};

const mealPayload = (payload: Partial<AdminMealPayload>) => ({
  ...payload,
  ...(payload.status ? { status: mealStatusCode[payload.status] } : {}),
});
