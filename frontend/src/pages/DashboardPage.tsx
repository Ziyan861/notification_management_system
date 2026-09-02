import { Link } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationBanners } from '../components/NotificationBanners';
import { NotificationList } from '../components/NotificationList';
import { Alert } from '../components/Alert';

export default function DashboardPage() {
  const { notifications, loading, error } = useNotifications();

  return (
    <div className="container pb-5" style={{ maxWidth: '52rem' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h4 mb-0">Notifications</h1>
        <Link to="/notifications/new" className="btn btn-sm btn-nms">
          + New
        </Link>
      </div>

      {error && <Alert variant="danger" message={error} />}

      <NotificationBanners />

      {loading && notifications.length === 0 && (
        <p className="text-nms-muted">Loading...</p>
      )}

      {!loading && notifications.length === 0 && (
        <div className="nms-panel nms-panel-tight text-center">
          <p className="text-nms-muted mb-3">Nothing here yet.</p>
          <Link to="/notifications/new" className="btn btn-sm btn-nms">
            Create your first notification
          </Link>
        </div>
      )}

      <NotificationList />
    </div>
  );
}