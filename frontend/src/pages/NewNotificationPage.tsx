import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationForm } from '../components/NotificationForm';
import type { NotificationFormValues } from '../components/NotificationForm';

export default function NewNotificationPage() {
  const navigate = useNavigate();
  const { create } = useNotifications();

  async function handleSubmit(values: NotificationFormValues) {
    await create(values);
    navigate('/dashboard');
  }

  return (
    <div className="container pb-5" style={{ maxWidth: '40rem' }}>
      <h1 className="h4 mb-4">New notification</h1>

      <NotificationForm
        submitLabel="Create"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard')}
      />
    </div>
  );
}