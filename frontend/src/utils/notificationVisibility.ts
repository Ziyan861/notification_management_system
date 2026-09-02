import { NotificationCategory } from '../models/notification';
import type { UserNotification } from '../models/notification';

export const INFO_TIMEOUT_MS = 90_000;
export const MAX_BANNERS = 5;

/**
 * Whether a notification should still appear as a banner.
 *
 * INFO expiry is derived from the server-stamped date rather than trusted from
 * a stored flag, so it stays correct across refreshes, closed tabs and other
 * devices - a timer alone would not.
 */
export function isBannerVisible(
  notification: UserNotification,
  now: number,
): boolean {
  if (notification.isClosed) return false;

  if (
    notification.category === NotificationCategory.INFO &&
    now - notification.date >= INFO_TIMEOUT_MS
  ) {
    return false;
  }

  return true;
}