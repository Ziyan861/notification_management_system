import { useState } from 'react';
import type { FormEvent } from 'react';
import { NotificationCategory } from '../models/notification';
import { Alert } from './Alert';
import { getApiErrorMessage } from '../services/apiError';

export interface NotificationFormValues {
  header: string;
  body: string;
  category: NotificationCategory;
}

interface NotificationFormProps {
  initialValues?: NotificationFormValues;
  submitLabel: string;
  onSubmit: (values: NotificationFormValues) => Promise<void>;
  onCancel: () => void;
}

const EMPTY: NotificationFormValues = {
  header: '',
  body: '',
  category: NotificationCategory.INFO,
};

export function NotificationForm({
  initialValues = EMPTY,
  submitLabel,
  onSubmit,
  onCancel,
}: NotificationFormProps) {
  const [values, setValues] = useState<NotificationFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof NotificationFormValues>(
    key: K,
    value: NotificationFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!values.header.trim()) errors.header = 'Header is required';
    if (!values.body.trim()) errors.body = 'Body is required';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        header: values.header.trim(),
        body: values.body.trim(),
        category: values.category,
      });
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Could not save the notification.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="nms-panel nms-panel-tight">
      {formError && <Alert variant="danger" message={formError} />}

      <div className="mb-3">
        <label htmlFor="header" className="form-label">
          Header
        </label>
        <input
          id="header"
          type="text"
          className={`form-control ${fieldErrors.header ? 'is-invalid' : ''}`}
          value={values.header}
          onChange={(e) => setField('header', e.target.value)}
        />
        {fieldErrors.header && (
          <div className="invalid-feedback">{fieldErrors.header}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="body" className="form-label">
          Body
        </label>
        <textarea
          id="body"
          rows={4}
          className={`form-control ${fieldErrors.body ? 'is-invalid' : ''}`}
          value={values.body}
          onChange={(e) => setField('body', e.target.value)}
        />
        {fieldErrors.body && (
          <div className="invalid-feedback">{fieldErrors.body}</div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          className="form-select"
          value={values.category}
          onChange={(e) =>
            setField('category', e.target.value as NotificationCategory)
          }
        >
          {Object.values(NotificationCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-nms" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-nms-ghost"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}