// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  INotification,
  MarkAllAsReadResponse,
  MarkAsReadResponse,
  notificationService,
} from "./notification-service";

export const useNotifications = (includeRead?: boolean) => {
  return useQuery({
    queryKey: ["notifications", includeRead],
    queryFn: () => notificationService.getUserNotifications(includeRead),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
};

export const useMerchantNotifications = (includeRead?: boolean) => {
  return useQuery({
    queryKey: ["merchant-notifications", includeRead],
    queryFn: () => notificationService.getMerchantNotifications(includeRead),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["unread-count"],
    queryFn: () => notificationService.getUnreadCount(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};

export const useMarkAsRead = (includeRead?: boolean) => {
  const queryClient = useQueryClient();

  return useMutation<MarkAsReadResponse, Error, string>({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: (data, notificationId) => {
      // Update the specific notification in the cache
      queryClient.setQueryData<INotification[]>(
        ["notifications", includeRead],
        (old) =>
          old?.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : notification
          )
      );

      // Update the unread count
      queryClient.setQueryData<number>(["unread-count"], (old) =>
        Math.max(0, (old || 0) - 1)
      );
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkAllAsReadResponse, Error, void>({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      // Update all notifications to read
      queryClient.setQueryData<Notification[]>(["notifications"], (old) =>
        old?.map((notification) => ({ ...notification, isRead: true }))
      );

      // Reset unread count to 0
      queryClient.setQueryData<number>(["unread-count"], 0);
    },
  });
};

export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, any>({
    mutationFn: (data) => notificationService.createNotification(data),
    onSuccess: () => {
      // Invalidate notifications queries to refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["merchant-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });
};
