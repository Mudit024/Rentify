import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { fetchCurrentUser } from './redux/slices/authSlice.js';
import { ROUTES } from './constants/routes.js';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import OwnerLayout from './layouts/OwnerLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import OwnerRoute from './routes/OwnerRoute.jsx';
import AdminRoute from './routes/AdminRoute.jsx';

// Common
import Spinner from './components/common/Spinner.jsx';

// =======================
// Lazy Pages
// =======================

// Public
const Home = lazy(() => import('./pages/public/Home.jsx'));
const CarListing = lazy(() => import('./pages/public/CarListing.jsx'));
const CarDetails = lazy(() => import('./pages/public/CarDetails.jsx'));
const NotFound = lazy(() => import('./pages/public/NotFound.jsx'));

// Auth
const Login = lazy(() => import('./pages/auth/Login.jsx'));
const Register = lazy(() => import('./pages/auth/Register.jsx'));
const GoogleCallback = lazy(() => import('./pages/auth/GoogleCallback.jsx'));

// Customer
const MyBookings = lazy(() => import('./pages/customer/MyBookings.jsx'));
const Wishlist = lazy(() => import('./pages/customer/Wishlist.jsx'));

// Owner
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard.jsx'));
const MyCars = lazy(() => import('./pages/owner/MyCars.jsx'));
const AddCar = lazy(() => import('./pages/owner/AddCar.jsx'));
const EditCar = lazy(() => import('./pages/owner/EditCar.jsx'));
const OwnerBookings = lazy(() => import('./pages/owner/OwnerBookings.jsx'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const ManageCars = lazy(() => import('./pages/admin/ManageCars.jsx'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers.jsx'));
const AllBookings = lazy(() => import('./pages/admin/AllBookings.jsx'));

const PageFallback = () => <Spinner fullPage />;

const App = () => {
  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.ui);
  const { bootstrapped } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!bootstrapped) {
      dispatch(fetchCurrentUser());
    }
  }, [bootstrapped, dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'text-sm font-medium',
          style: {
            background: theme === 'dark' ? '#1f2937' : '#ffffff',
            color: theme === 'dark' ? '#f8f7f4' : '#111827',
            border: '1px solid',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          },
        }}
      />

      <Suspense fallback={<PageFallback />}>
        <Routes>

          {/* Public */}
          <Route element={<MainLayout />}>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.CARS} element={<CarListing />} />
          </Route>

          {/* Auth */}
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
          </Route>

          {/* Google OAuth */}
          <Route
            path={ROUTES.GOOGLE_SUCCESS}
            element={<GoogleCallback />}
          />

          {/* Customer */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route
                path={ROUTES.MY_BOOKINGS}
                element={<MyBookings />}
              />
              <Route
                path={ROUTES.WISHLIST}
                element={<Wishlist />}
              />
              <Route
                path={ROUTES.CAR_DETAILS}
                element={<CarDetails />}
              />
            </Route>
          </Route>

          {/* Owner */}
          <Route element={<OwnerRoute />}>
            <Route element={<OwnerLayout />}>
              <Route
                path={ROUTES.OWNER_DASHBOARD}
                element={<OwnerDashboard />}
              />
              <Route
                path={ROUTES.OWNER_CARS}
                element={<MyCars />}
              />
              <Route
                path={ROUTES.OWNER_ADD_CAR}
                element={<AddCar />}
              />
              <Route
                path={ROUTES.OWNER_EDIT_CAR}
                element={<EditCar />}
              />
              <Route
                path={ROUTES.OWNER_BOOKINGS}
                element={<OwnerBookings />}
              />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route
                path={ROUTES.ADMIN_DASHBOARD}
                element={<AdminDashboard />}
              />
              <Route
                path={ROUTES.ADMIN_CARS}
                element={<ManageCars />}
              />
              <Route
                path={ROUTES.ADMIN_USERS}
                element={<ManageUsers />}
              />
              <Route
                path={ROUTES.ADMIN_BOOKINGS}
                element={<AllBookings />}
              />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>
    </>
  );
};

export default App;