import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationList() {
  const { notifications, remove } = useNotifications();
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string, header: string) {
    if (!window.confirm(`Delete "${header}"? This cannot be undone.`)) return;

    setBusyId(id);

    try {
      await remove(id);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {notifications.map((item) => {
        const isOpen = openId === item._id;

        return (
          <div
            key={item._id}
            className={`nms-panel nms-cat-bar nms-cat-${item.category} mb-2`}
          >
            <div className="d-flex align-items-center gap-2 p-3">
              <button
                type="button"
                className="btn btn-sm btn-nms-ghost flex-grow-1 text-start d-flex align-items-center gap-2"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : item._id)}
              >
                <span className="nms-badge">{item.category}</span>
                <span className="fw-semibold">{item.header}</span>
                {item.isClosed && (
                  <span className="text-nms-muted small ms-1">(dismissed)</span>
                )}
                <span className="ms-auto text-nms-muted">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              <Link
                to={`/notifications/${item._id}`}
                className="btn btn-sm btn-nms-ghost"
              >
                Edit
              </Link>

              <button
                type="button"
                className="btn btn-sm btn-nms-ghost"
                disabled={busyId === item._id}
                onClick={() => void handleDelete(item._id, item.header)}
              >
                {busyId === item._id ? '...' : 'Delete'}
              </button>
            </div>

            {isOpen && (
              <div className="px-3 pb-3">
                <p className="mb-2">{item.body}</p>
                <small className="text-nms-muted nms-mono">
                  {new Date(item.date).toLocaleString()}
                </small>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}