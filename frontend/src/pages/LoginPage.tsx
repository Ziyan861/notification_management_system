import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Alert';
import { getApiErrorMessage } from '../services/apiError';

interface LocationState {
  from?: { pathname: string };
  message?: string;
}

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      await login(username.trim(), password);
      navigate(state?.from?.pathname ?? '/dashboard', { replace: true });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, 'Incorrect username or password.'),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: '24rem' }}>
      <h1 className="h3 text-center my-4">Login</h1>

      {state?.message && <Alert variant="success" message={state.message} />}
      {formError && <Alert variant="danger" message={formError} />}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {fieldErrors.username && (
            <div className="invalid-feedback">{fieldErrors.username}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && (
            <div className="invalid-feedback">{fieldErrors.password}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={submitting}
        >
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center mt-3">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}