import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Car,
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck,
  Heart,
  LogOut,
  ArrowLeft,
  Navigation,
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
  `text-sm font-semibold tracking-wide transition-all duration-300 relative py-1.5 px-3.5 rounded-xl ${isActive
    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30'
    : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/40'
  }`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const { user, role, isAuthenticated, logout } = useAuth();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const dashboardRoute =
    role === ROLES.ADMIN
      ? ROUTES.ADMIN_DASHBOARD
      : role === ROLES.OWNER
        ? ROUTES.OWNER_DASHBOARD
        : ROUTES.CUSTOMER_DASHBOARD;

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
    <header className="sticky top-0 z-50 border-b border-gray-100/50 bg-white/70 backdrop-blur-xl dark:border-gray-800/50 dark:bg-luxury-charcoal/70 shadow-sm">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}

        <div className="flex items-center gap-3">
          {location.pathname !== '/' && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-luxury-deep/50 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-500 text-gray-500 dark:text-gray-400 transition-all shadow-sm cursor-pointer active:scale-95"
              title="Go Back"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
          )}

          <Link to={isAuthenticated && (role === ROLES.OWNER || role === ROLES.ADMIN) ? dashboardRoute : ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-indigo-500 to-luxury-gold p-[2px] shadow-premium group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-luxury-deep">
                <Car className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>

            <span className="font-display text-2.5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary-500 to-luxury-gold dark:from-white dark:via-primary-400 dark:to-luxury-gold">
              Rentify
            </span>
          </Link>
        </div>

        {/* Desktop Links */}

        {!(isAuthenticated && (role === ROLES.OWNER || role === ROLES.ADMIN)) && (
          <div className="hidden items-center gap-6 md:flex">
            <NavLink to={ROUTES.HOME} end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to={ROUTES.CARS} className={navLinkClass}>
              Browse Cars
            </NavLink>

            {isAuthenticated && role === ROLES.CUSTOMER && (
              <NavLink to={ROUTES.ACTIVE_RENTAL} className={navLinkClass}>
                Active Rental
              </NavLink>
            )}
          </div>
        )}

        {/* Right Side */}

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-semibold text-gray-700 hover:text-primary-600 dark:text-gray-300 py-2 px-4 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/40"
              >
                Log In
              </Link>

              <Link
                to={ROUTES.REGISTER}
                className="rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-premium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 ring-2 ring-primary-500/10 hover:ring-primary-500/30 shadow-sm transition-all duration-300"
              >
                {initials(user?.name)}
              </button>

              {profileMenuOpen && (
                <div
                  onMouseLeave={() => setProfileMenuOpen(false)}
                  className="absolute right-0 mt-3 w-58 overflow-hidden rounded-2xl border border-gray-150 bg-white/95 shadow-premium dark:border-gray-800 dark:bg-luxury-deep/95 backdrop-blur-lg transition-all duration-300"
                >
                  <div className="border-b border-gray-100 px-4 py-3.5 dark:border-gray-800">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-luxury-ivory">
                      {user?.name}
                    </p>

                    <p className="text-xs font-semibold capitalize text-primary-500 dark:text-primary-400 mt-0.5">
                      {role}
                    </p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <Link
                      to={dashboardRoute}
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary-500" />
                      Dashboard
                    </Link>

                    {role === ROLES.CUSTOMER && (
                      <>
                        <Link
                          to={ROUTES.ACTIVE_RENTAL}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        >
                          <Navigation className="h-4 w-4 text-primary-500" />
                          Active Rental
                        </Link>

                        <Link
                          to={ROUTES.MY_BOOKINGS}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        >
                          <CalendarCheck className="h-4 w-4 text-primary-500" />
                          My Bookings
                        </Link>

                        <Link
                          to={ROUTES.WISHLIST}
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                        >
                          <Heart className="h-4 w-4 text-primary-500" />
                          Wishlist
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-800 my-1.5" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
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
                      to={ROUTES.ACTIVE_RENTAL}
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Active Rental
                    </Link>

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