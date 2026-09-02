import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { NotificationsProvider } from './context/NotificationsProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NavBar } from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NewNotificationPage from './pages/NewNotificationPage';
import EditNotificationPage from './pages/EditNotificationPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NotificationsProvider>
          <NavBar />

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications/new"
              element={
                <ProtectedRoute>
                  <NewNotificationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications/:id"
              element={
                <ProtectedRoute>
                  <EditNotificationPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </NotificationsProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;