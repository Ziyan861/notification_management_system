import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { NotificationsContext } from './notifications-context';
import type { NotificationsContextValue } from './notifications-context';
import type {
  CreateNotificationInput,
  UpdateNotificationInput,
  UserNotification,
} from '../models/notification';
import { notificationService } from '../services/notificationService';
import { getApiErrorMessage } from '../services/apiError';
import { useAuth } from '../hooks/useAuth';

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setNotifications(await notificationService.getAll());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load notifications.'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load once on login; clear on logout so the next user starts clean.
  useEffect(() => {
    if (isAuthenticated) {
      void refresh();
    } else {
      setNotifications([]);
      setError(null);
    }
  }, [isAuthenticated, refresh]);

  const create = useCallback(async (input: CreateNotificationInput) => {
    const created = await notificationService.create(input);
    setNotifications((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(
    async (id: string, input: UpdateNotificationInput) => {
      const updated = await notificationService.update(id, input);
      setNotifications((prev) =>
        prev.map((item) => (item._id === id ? updated : item)),
      );
      return updated;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await notificationService.remove(id);
    setNotifications((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const value = useMemo<NotificationsContextValue>(
    () => ({ notifications, loading, error, refresh, create, update, remove }),
    [notifications, loading, error, refresh, create, update, remove],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}