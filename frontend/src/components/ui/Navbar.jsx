import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Car, Menu, X, User, LayoutDashboard, LogOut, Heart, CalendarCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { toggleMobileMenu, closeMobileMenu } from '../../redux/slices/uiSlice.js';
import ThemeToggle from './ThemeToggle.jsx';
import { ROUTES } from '../../constants/routes.js';
import { initials } from '../../utils/formatters.js';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-gray-600 dark:text-gray-300 hover:text-primary-600'}`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const { user, isAuthenticated, logout, role } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  const dashboardRoute =
    role === 'admin' ? ROUTES.ADMIN_DASHBOARD : role === 'owner' ? ROUTES.OWNER_DASHBOARD : ROUTES.PROFILE;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-luxury-charcoal/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-600 p-1.5">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-gray-900 dark:text-luxury-ivory">DriveEase</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to={ROUTES.HOME} className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to={ROUTES.CARS} className={navLinkClass}>
            Browse Cars
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-sm font-semibold text-primary-700 dark:text-primary-300"
              >
                {initials(user?.name)}
              </button>
              {profileMenuOpen && (
                <div
                  onMouseLeave={() => setProfileMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 py-2 shadow-premium"
                >
                  <div className="border-b border-gray-100 dark:border-gray-800 px-4 py-2">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-luxury-ivory">{user?.name}</p>
                    <p className="truncate text-xs text-gray-500 capitalize">{role} account</p>
                  </div>
                  <Link
                    to={dashboardRoute}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  {role === 'customer' && (
                    <>
                      <Link
                        to={ROUTES.MY_BOOKINGS}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <CalendarCheck className="h-4 w-4" /> My Bookings
                      </Link>
                      <Link
                        to={ROUTES.WISHLIST}
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Heart className="h-4 w-4" /> Wishlist
                      </Link>
                    </>
                  )}
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600">
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => dispatch(toggleMobileMenu())} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 dark:border-gray-800 md:hidden">
          <div className="space-y-1 px-4 py-3">
            <Link to={ROUTES.HOME} onClick={() => dispatch(closeMobileMenu())} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Home
            </Link>
            <Link to={ROUTES.CARS} onClick={() => dispatch(closeMobileMenu())} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Browse Cars
            </Link>
            {isAuthenticated ? (
              <>
                <Link to={dashboardRoute} onClick={() => dispatch(closeMobileMenu())} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="block w-full py-2 text-left text-sm font-medium text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} onClick={() => dispatch(closeMobileMenu())} className="block py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Log in
                </Link>
                <Link to={ROUTES.REGISTER} onClick={() => dispatch(closeMobileMenu())} className="block py-2 text-sm font-medium text-primary-600">
                  Get Started
                </Link>
              </>
            )}
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
