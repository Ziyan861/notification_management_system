export type AlertVariant = 'success' | 'danger' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  message: string;
  onClose?: () => void;
}

export function Alert({ variant, message, onClose }: AlertProps) {
  return (
    <div
      className={`alert alert-${variant} ${onClose ? 'alert-dismissible' : ''}`}
      role="alert"
    >
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      )}
    </div>
  );
}