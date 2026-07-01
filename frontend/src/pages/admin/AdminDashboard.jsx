import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Car, CalendarCheck, DollarSign, Clock, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { fetchAdminDashboard } from '../../redux/slices/adminSlice.js';
import StatCard from '../../components/common/StatCard.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { ROUTES } from '../../constants/routes.js';
import { formatCurrency } from '../../utils/formatters.js';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchAdminDashboard()); }, [dispatch]);

  if (!dashboard) return <Spinner fullPage />;

  const stats = [
    { label: 'Total Users', value: dashboard.totalUsers, icon: Users, accent: 'primary' },
    { label: 'Owners', value: dashboard.totalOwners, icon: UserCheck, accent: 'emerald' },
    { label: 'Customers', value: dashboard.totalCustomers, icon: Users, accent: 'primary' },
    { label: 'Total Cars', value: dashboard.totalCars, icon: Car, accent: 'primary' },
    { label: 'Pending Approval', value: dashboard.pendingCars, icon: Clock, accent: 'amber' },
    { label: 'Total Bookings', value: dashboard.totalBookings, icon: CalendarCheck, accent: 'primary' },
    { label: 'Pending Bookings', value: dashboard.pendingBookings, icon: Clock, accent: 'amber' },
    { label: 'Completed Bookings', value: dashboard.completedBookings, icon: CheckCircle, accent: 'emerald' },
    { label: 'Platform Revenue', value: formatCurrency(dashboard.totalRevenue), icon: DollarSign, accent: 'gold' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform-wide overview</p>
      </div>

      {dashboard.pendingCars > 0 && (
        <Link to={ROUTES.ADMIN_LISTINGS}>
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
            <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              {dashboard.pendingCars} car listing{dashboard.pendingCars > 1 ? 's' : ''} waiting for your approval →
            </p>
          </div>
        </Link>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { to: ROUTES.ADMIN_LISTINGS, icon: ShieldCheck, title: 'Review Listings', desc: 'Approve or reject pending car listings' },
          { to: ROUTES.ADMIN_USERS, icon: Users, title: 'Manage Users', desc: 'View users and update roles' },
          { to: ROUTES.ADMIN_BOOKINGS, icon: CalendarCheck, title: 'All Bookings', desc: 'Platform-wide booking activity' },
        ].map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-primary-400 transition-colors">
            <Icon className="h-6 w-6 text-luxury-gold mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-luxury-ivory">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
