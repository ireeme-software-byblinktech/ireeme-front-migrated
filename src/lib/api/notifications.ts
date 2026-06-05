import { apiClient } from "./client";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    return apiClient<NotificationsResponse>(`/api/v1/notifications?${query.toString()}`);
  },

  markAsRead: (id: string) =>
    apiClient<Notification>(`/api/v1/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    apiClient<{ message: string }>("/api/v1/notifications/read-all", {
      method: "PATCH",
    }),
};
