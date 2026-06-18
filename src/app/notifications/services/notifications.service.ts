import { apiClient } from "@/shared/api/client";

export type NotificationItem = {
  id: string;
  category: string;
  title: string;
  body: string;
  targetType?: string;
  targetId?: string;
  read: boolean;
  createdAt: string;
};

export type NotificationPreference = {
  category: string;
  push: boolean;
  email: boolean;
  whatsapp: boolean;
  locked: boolean;
};

export type NotificationsResponse = {
  items: NotificationItem[];
  unreadCount: number;
  preferences: NotificationPreference[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const notificationsService = {
  getNotifications: (page = 1, limit = 10) =>
    apiClient.get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`),
  getPreferences: () => apiClient.get<NotificationPreference[]>("/notifications/preferences"),
  markAllRead: () => apiClient.post<{ success: true }, Record<string, never>>("/notifications/read-all", {}),
  markRead: (notificationId: string) =>
    apiClient.patch<NotificationItem, Record<string, never>>(`/notifications/${notificationId}/read`, {}),
  module: "notifications",
  updatePreference: (
    category: string,
    body: Partial<Pick<NotificationPreference, "email" | "push" | "whatsapp">>,
  ) => apiClient.patch<NotificationPreference, typeof body>(`/notifications/preferences/${category}`, body),
};

