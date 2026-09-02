import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="nms-nav navbar navbar-expand sticky-top px-3 px-md-4 py-2 mb-4">
      <NavLink to="/dashboard" className="navbar-brand nms-brand mb-0">
        &lt;/&gt; notifications
      </NavLink>

      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/notifications/new" className="nav-link">
            Create
          </NavLink>
        </li>
      </ul>

      <span className="text-nms-muted d-none d-sm-inline me-3 small">
        {user?.fullName}
      </span>

      <button
        type="button"
        className="btn btn-sm btn-nms-ghost"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}