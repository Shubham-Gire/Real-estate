import { ApiClient } from './api';
import { PagedResponse } from '../types/api';
import { AppNotification } from '../types/notification';

export const notificationService = {
  getNotifications: (page = 0, size = 15): Promise<PagedResponse<AppNotification>> => {
    return ApiClient.get<PagedResponse<AppNotification>>('/notifications', { page, size });
  },

  getUnreadCount: (): Promise<number> => {
    return ApiClient.get<number>('/notifications/unread-count');
  },

  markAsRead: (id: string): Promise<void> => {
    return ApiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: (): Promise<void> => {
    return ApiClient.patch('/notifications/read-all');
  },
};
