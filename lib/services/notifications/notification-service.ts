import { backendAxios } from "@/lib/backendaxios";

export enum NotificationType {
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success",
  ERROR = "error",
}

export enum NotificationTag {
  MESSAGE = "message",
  COMMENT = "comment",
  CONNECT = "connect",
}

export enum NotificationAudience {
  MERCHANT = "merchant",
  USER = "user",
  MERCHANT_USER = "merchant_user",
}

export interface INotification {
  id: string;
  type: NotificationType;
  tag: NotificationTag;
  audience: NotificationAudience;
  title: string;
  body: string;
  actor?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: INotification[];
  unreadCount: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  notification: INotification;
}

export interface MarkAllAsReadResponse {
  marked: number;
}

export const notificationService = {
  getNotifications: async (includeRead?: boolean): Promise<INotification[]> => {
    const params = includeRead ? { includeRead: "true" } : {};
    const response = await backendAxios.get("/notifications", { params });
    return response.data;
  },

  // Get user notifications
  getUserNotifications: async (
    includeRead?: boolean
  ): Promise<INotification[]> => {
    const params = includeRead ? { includeRead: "true" } : {};
    const response = await backendAxios.get("/user/notifications", { params });
    return response.data;
  },

  // Get merchant notifications
  getMerchantNotifications: async (
    includeRead?: boolean
  ): Promise<INotification[]> => {
    const params = includeRead ? { includeRead: "true" } : {};
    const response = await backendAxios.get("/notifications/merchant", {
      params,
    });
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await backendAxios.get("/notifications/unread-count");
    return response.data;
  },

  getUserUnreadCount: async (): Promise<number> => {
    const response = await backendAxios.get("/user/notifications/unread-count");
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<MarkAsReadResponse> => {
    const response = await backendAxios.post(
      `/user/notifications/${notificationId}/read`
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<MarkAllAsReadResponse> => {
    const response = await backendAxios.post("/notifications/mark-all-read");
    return response.data;
  },

  // Create notification (admin only)
  createNotification: async (data: {
    type: string;
    tag: string;
    audience: string;
    title: string;
    body: string;
    actor?: string;
  }): Promise<Notification> => {
    const response = await backendAxios.post("/notifications", data);
    return response.data;
  },
};
