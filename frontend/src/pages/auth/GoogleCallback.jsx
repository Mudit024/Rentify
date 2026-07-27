import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth.js';
import Spinner from '../../components/common/Spinner.jsx';

import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/index.js';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const hydrate = async () => {
      try {
        const user = await refreshUser();

        toast.success(
          `Welcome${user?.name ? `, ${user.name}` : ''}!`
        );

        if (user?.needsRoleSelection) {
          navigate(ROUTES.SELECT_ROLE, { replace: true });
        } else if (user?.role === ROLES.ADMIN) {
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        } else if (user?.role === ROLES.OWNER) {
          navigate(ROUTES.OWNER_DASHBOARD, { replace: true });
        } else {
          navigate(ROUTES.HOME, { replace: true });
        }
      } catch (err) {
        toast.error(
          err?.message || 'Sign-in failed. Please try again.'
        );

        navigate(ROUTES.LOGIN, {
          replace: true,
        });
      }
    };

    hydrate();
  }, [navigate, refreshUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-luxury-ivory dark:bg-luxury-charcoal">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completing sign in...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;