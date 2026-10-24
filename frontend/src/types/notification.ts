export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  linkUrl?: string;
  read: boolean;
  createdAt: string;
}
