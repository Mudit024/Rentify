import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth.js';
import Spinner from '../../components/common/Spinner.jsx';
import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/index.js';

// The backend redirects here after Google OAuth succeeds.
// The JWT cookie is already set — we just need to fetch /me to hydrate Redux.
const GoogleCallback = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const result = await refreshUser();
        const user = result.payload;
        toast.success(`Welcome${user?.name ? `, ${user.name}` : ''}!`);
        if (user?.role === ROLES.ADMIN) navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        else if (user?.role === ROLES.OWNER) navigate(ROUTES.OWNER_DASHBOARD, { replace: true });
        else navigate(ROUTES.HOME, { replace: true });
      } catch {
        toast.error('Sign-in failed. Please try again.');
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };
    hydrate();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-luxury-ivory dark:bg-luxury-charcoal">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Completing sign-in…</p>
    </div>
  );
};

export default GoogleCallback;
