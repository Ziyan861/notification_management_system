export const NotificationCategory = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;

export type NotificationCategory =
  (typeof NotificationCategory)[keyof typeof NotificationCategory];

export interface UserNotification {
  _id: string;
  header: string;
  body: string;
  category: NotificationCategory;
  isClosed: boolean;
  userId: string;
  date: number;
}

export interface CreateNotificationInput {
  header: string;
  body: string;
  category: NotificationCategory;
}

export interface UpdateNotificationInput {
  header?: string;
  body?: string;
  category?: NotificationCategory;
  isClosed?: boolean;
}