import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationCategory } from '../models/notification';
import {
  INFO_TIMEOUT_MS,
  MAX_BANNERS,
  isBannerVisible,
} from '../utils/notificationVisibility';

export function NotificationBanners() {
  const { notifications, update } = useNotifications();
  const [now, setNow] = useState(() => Date.now());

  // Drives re-renders so INFO banners disappear on time without a reload.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist the auto-close so the stored flag matches what the user sees.
  // The ref stops the same id being sent repeatedly while the PUT is in flight.
  const persisted = useRef<Set<string>>(new Set());

  useEffect(() => {
    notifications
      .filter(
        (item) =>
          !item.isClosed &&
          item.category === NotificationCategory.INFO &&
          now - item.date >= INFO_TIMEOUT_MS &&
          !persisted.current.has(item._id),
      )
      .forEach((item) => {
        persisted.current.add(item._id);
        void update(item._id, { isClosed: true }).catch(() => {
          persisted.current.delete(item._id);
        });
      });
  }, [notifications, now, update]);

  const visible = notifications.filter((item) => isBannerVisible(item, now));

  if (visible.length === 0) return null;

  const hasMore = visible.length > MAX_BANNERS;
  const shown = hasMore ? visible.slice(0, MAX_BANNERS - 1) : visible;

  async function dismiss(id: string) {
    try {
      await update(id, { isClosed: true });
    } catch {
      // Non-fatal: the list is refetched on next load.
    }
  }

  return (
    <div className="mb-4">
      {shown.map((item) => (
        <div
          key={item._id}
          className={`nms-panel nms-cat-bar nms-cat-${item.category} d-flex align-items-start gap-3 p-3 mb-2`}
        >
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="nms-badge">{item.category}</span>
              <strong>{item.header}</strong>
            </div>
            <div className="text-nms-muted small">{item.body}</div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-nms-ghost"
            aria-label={`Dismiss ${item.header}`}
            onClick={() => void dismiss(item._id)}
          >
            ✕
          </button>
        </div>
      ))}

      {hasMore && (
        <div className="nms-panel p-3 text-center text-nms-muted small">
          You have more notifications
        </div>
      )}
    </div>
  );
}