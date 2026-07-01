import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';
import { ROUTES } from '../constants/routes.js';
import { ROLES } from '../constants/index.js';

const AdminRoute = () => {
  const { isAuthenticated, bootstrapped, role } = useAuth();

  if (!bootstrapped) return <Spinner fullPage />;
  if (!isAuthenticated) return <Navigate to={ROUTES.LOGIN} replace />;
  if (role !== ROLES.ADMIN) return <Navigate to={ROUTES.HOME} replace />;

  return <Outlet />;
};

export default AdminRoute;
