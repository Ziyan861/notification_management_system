import { createContext } from 'react';
import type {
  CreateNotificationInput,
  UpdateNotificationInput,
  UserNotification,
} from '../models/notification';

export interface NotificationsContextValue {
  notifications: UserNotification[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: CreateNotificationInput) => Promise<UserNotification>;
  update: (
    id: string,
    input: UpdateNotificationInput,
  ) => Promise<UserNotification>;
  remove: (id: string) => Promise<void>;
}

export const NotificationsContext = createContext<
  NotificationsContextValue | undefined
>(undefined);