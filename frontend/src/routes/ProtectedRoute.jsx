import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';
import { ROUTES } from '../constants/routes.js';

const ProtectedRoute = () => {
  const { isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  // Wait for the initial /me check before redirecting so we don't flash
  // the login page for authenticated users on a hard refresh.
  if (!bootstrapped) return <Spinner fullPage />;

  return isAuthenticated
    ? <Outlet />
    : <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
};

export default ProtectedRoute;
