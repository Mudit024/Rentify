import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Car, Key, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth.js';
import { selectUserRole } from '../../redux/slices/authSlice.js';
import Button from '../../components/common/Button.jsx';
import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/index.js';

const SelectRole = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, bootstrapped, logout, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);

  // Sync state if user already has a temporary role in state
  useEffect(() => {
    if (bootstrapped) {
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN, { replace: true });
      } else if (!user?.needsRoleSelection) {
        // Already selected, redirect to appropriate home/dashboard
        if (user?.role === ROLES.ADMIN) {
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        } else if (user?.role === ROLES.OWNER) {
          navigate(ROUTES.OWNER_DASHBOARD, { replace: true });
        } else {
          navigate(ROUTES.HOME, { replace: true });
        }
      } else if (user?.role && [ROLES.CUSTOMER, ROLES.OWNER].includes(user.role)) {
        setSelectedRole(user.role);
      }
    }
  }, [user, isAuthenticated, bootstrapped, navigate]);

  const handleConfirmRole = async () => {
    if (!selectedRole) {
      toast.error('Please select a role to continue.');
      return;
    }

    try {
      const res = await dispatch(selectUserRole({ role: selectedRole })).unwrap();
      toast.success('Profile configured successfully!');
      
      if (res.role === ROLES.OWNER) {
        navigate(ROUTES.OWNER_DASHBOARD, { replace: true });
      } else {
        navigate(ROUTES.HOME, { replace: true });
      }
    } catch (err) {
      toast.error(err || 'Failed to select role. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (_) {
      toast.error('Logout failed. Please refresh and try again.');
    }
  };

  if (!bootstrapped || !isAuthenticated || !user?.needsRoleSelection) {
    return null; // Let the useEffect handle redirects
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory leading-none">
          Choose Your Role 🤝
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
          Welcome to Rentify, <span className="font-bold text-gray-900 dark:text-luxury-ivory">{user.name}</span>!
          Please select how you would like to use our platform. You can update your selection later.
        </p>
      </div>

      <div className="space-y-4">
        {/* Renter / Customer Option */}
        <button
          type="button"
          onClick={() => setSelectedRole(ROLES.CUSTOMER)}
          className={`w-full flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 cursor-pointer ${
            selectedRole === ROLES.CUSTOMER
              ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-500/10 shadow-premium'
              : 'border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-luxury-deep/40 hover:bg-white/70 dark:hover:bg-luxury-deep/70'
          }`}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
            selectedRole === ROLES.CUSTOMER
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
            <Car className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-luxury-ivory text-sm sm:text-base">
              🚗 Rent a Car (Renter)
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Browse from a wide range of verified cars, book effortlessly, and enjoy smooth rides.
            </p>
          </div>
        </button>

        {/* Host / Owner Option */}
        <button
          type="button"
          onClick={() => setSelectedRole(ROLES.OWNER)}
          className={`w-full flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 cursor-pointer ${
            selectedRole === ROLES.OWNER
              ? 'border-primary-500 bg-primary-50/20 dark:bg-primary-500/10 shadow-premium'
              : 'border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-luxury-deep/40 hover:bg-white/70 dark:hover:bg-luxury-deep/70'
          }`}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
            selectedRole === ROLES.OWNER
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
          }`}>
            <Key className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-luxury-ivory text-sm sm:text-base">
              🔑 List My Car (Host)
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Rent out your vehicles, manage booking requests, track earnings, and run your car rental business.
            </p>
          </div>
        </button>
      </div>

      <div className="pt-2 space-y-3">
        <Button
          onClick={handleConfirmRole}
          loading={isLoading}
          disabled={!selectedRole}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 py-3 font-bold text-white shadow-premium hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
          size="lg"
        >
          Confirm & Proceed
        </Button>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer bg-transparent border-0 py-2"
        >
          <LogOut className="h-4 w-4" />
          Sign out instead
        </button>
      </div>
    </div>
  );
};

export default SelectRole;
