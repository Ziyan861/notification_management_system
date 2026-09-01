import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Alert } from '../components/Alert';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/apiError';

export default function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
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

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (/\s/.test(username)) {
      errors.username = 'Username must not contain spaces';
    }

    if (password.length < 6) {
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
      await authService.register(fullName.trim(), username.trim(), password);
      navigate('/login', {
        replace: true,
        state: { message: 'Account created. Please log in to continue.' },
      });
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Registration failed.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: '24rem' }}>
      <h1 className="h3 text-center my-4">Register</h1>

      {formError && <Alert variant="danger" message={formError} />}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            className={`form-control ${fieldErrors.fullName ? 'is-invalid' : ''}`}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {fieldErrors.fullName && (
            <div className="invalid-feedback">{fieldErrors.fullName}</div>
          )}
        </div>

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
            autoComplete="new-password"
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
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-3">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}