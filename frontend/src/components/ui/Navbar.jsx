import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Car,
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck,
  Heart,
  LogOut,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuth } from '../../hooks/useAuth.js';
import { toggleMobileMenu, closeMobileMenu } from '../../redux/slices/uiSlice.js';
import ThemeToggle from './ThemeToggle.jsx';

import { ROUTES } from '../../constants/routes.js';
import { ROLES } from '../../constants/index.js';
import { initials } from '../../utils/formatters.js';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive
    ? 'text-primary-600'
    : 'text-gray-600 hover:text-primary-600 dark:text-gray-300'
  }`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const { user, role, isAuthenticated, logout } = useAuth();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const dashboardRoute =
    role === ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : role === ROLES.OWNER
        ? ROUTES.OWNER_DASHBOARD
        : ROUTES.MY_BOOKINGS;

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(closeMobileMenu());
      setProfileMenuOpen(false);
      navigate(ROUTES.HOME);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-xl dark:border-gray-800 dark:bg-luxury-charcoal/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}

        <Link to={isAuthenticated && (role === ROLES.OWNER || role === ROLES.ADMIN) ? dashboardRoute : ROUTES.HOME} className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-600 p-2">
            <Car className="h-5 w-5 text-white" />
          </div>

          <span className="font-display text-xl font-bold text-gray-900 dark:text-white">
            Rentify
          </span>
        </Link>

        {/* Desktop Links */}

        {!(isAuthenticated && (role === ROLES.OWNER || role === ROLES.ADMIN)) && (
          <div className="hidden items-center gap-8 md:flex">
            <NavLink to={ROUTES.HOME} end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to={ROUTES.CARS} className={navLinkClass}>
              Browse Cars
            </NavLink>
          </div>
        )}

        {/* Right Side */}

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300"
              >
                Log In
              </Link>

              <Link
                to={ROUTES.REGISTER}
                className="rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-semibold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
              >
                {initials(user?.name)}
              </button>

              {profileMenuOpen && (
                <div
                  onMouseLeave={() => setProfileMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                    <p className="truncate text-sm font-semibold">
                      {user?.name}
                    </p>

                    <p className="text-xs capitalize text-gray-500">
                      {role}
                    </p>
                  </div>

                  <Link
                    to={dashboardRoute}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>

                  {role === ROLES.CUSTOMER && (
                    <>
                      <Link
                        to={ROUTES.MY_BOOKINGS}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <CalendarCheck className="h-4 w-4" />
                        My Bookings
                      </Link>

                      <Link
                        to={ROUTES.WISHLIST}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </Link>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Button */}

        <button
          type="button"
          onClick={() => dispatch(toggleMobileMenu())}
          className="md:hidden"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}

      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-luxury-charcoal md:hidden">
          <div className="space-y-3">
            {!(isAuthenticated && (role === ROLES.OWNER || role === ROLES.ADMIN)) && (
              <>
                <Link to={ROUTES.HOME} onClick={() => dispatch(closeMobileMenu())}>
                  Home
                </Link>

                <Link to={ROUTES.CARS} onClick={() => dispatch(closeMobileMenu())}>
                  Browse Cars
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <Link
                  to={dashboardRoute}
                  onClick={() => dispatch(closeMobileMenu())}
                >
                  Dashboard
                </Link>

                {role === ROLES.CUSTOMER && (
                  <>
                    <Link
                      to={ROUTES.MY_BOOKINGS}
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      My Bookings
                    </Link>

                    <Link
                      to={ROUTES.WISHLIST}
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Wishlist
                    </Link>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="block text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => dispatch(closeMobileMenu())}
                >
                  Log In
                </Link>

                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => dispatch(closeMobileMenu())}
                  className="text-primary-600"
                >
                  Get Started
                </Link>
              </>
            )}

            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;