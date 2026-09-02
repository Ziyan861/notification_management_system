import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { notificationService } from '../services/notificationService';
import { getApiErrorMessage } from '../services/apiError';
import { NotificationForm } from '../components/NotificationForm';
import type { NotificationFormValues } from '../components/NotificationForm';
import type { UserNotification } from '../models/notification';
import { Alert } from '../components/Alert';

export default function EditNotificationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { update } = useNotifications();

  const [notification, setNotification] = useState<UserNotification | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Guards against setting state after the component unmounts, which also
    // covers StrictMode running effects twice in development.
    let cancelled = false;

    setLoading(true);
    setLoadError(null);

    notificationService
      .getById(id)
      .then((data) => {
        if (!cancelled) setNotification(data);
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(
            getApiErrorMessage(error, 'That notification does not exist.'),
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(values: NotificationFormValues) {
    if (!id) return;
    await update(id, values as Parameters<typeof update>[1]);
    navigate('/dashboard');
  }

  if (loading) {
    return <div className="container pb-5 text-nms-muted">Loading...</div>;
  }

  if (loadError || !notification) {
    return (
      <div className="container pb-5" style={{ maxWidth: '40rem' }}>
        <Alert variant="danger" message={loadError ?? 'Not found.'} />
        <Link to="/dashboard" className="btn btn-sm btn-nms-ghost">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container pb-5" style={{ maxWidth: '40rem' }}>
      <h1 className="h4 mb-4">Edit notification</h1>

      <NotificationForm
        initialValues={{
          header: notification.header,
          body: notification.body,
          category: notification.category,
        }}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard')}
      />
    </div>
  );
}