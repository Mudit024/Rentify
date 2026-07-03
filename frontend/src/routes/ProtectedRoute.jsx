import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';

import { ROUTES } from '../constants/routes.js';

const ProtectedRoute = () => {
  const { isAuthenticated, bootstrapped } = useAuth();
  const location = useLocation();

  // Wait until authentication bootstrap completes.
  // Prevents redirect flicker on page refresh.
  if (!bootstrapped) {
    return <Spinner fullPage />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;