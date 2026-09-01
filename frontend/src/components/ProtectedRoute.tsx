import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // `replace` keeps the protected URL out of history, so the back button
    // does not bounce the user between login and a page they cannot see.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}