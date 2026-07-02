import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Car,
  CalendarCheck,
  DollarSign,
  Clock,
  UserCheck,
} from "lucide-react";

import { fetchAdminDashboard } from "../../redux/slices/adminSlice.js";
import StatCard from "../../components/common/StatCard.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import { ROUTES } from "../../constants/routes.js";
import { formatCurrency } from "../../utils/formatters.js";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, status } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  if (status === "loading" && !dashboard) {
    return <Spinner fullPage />;
  }

  if (status === "failed") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Failed to load dashboard.</p>
      </div>
    );
  }

  if (!dashboard) return null;

  const stats = [
    {
      label: "Total Users",
      value: dashboard.totalUsers,
      icon: Users,
      accent: "primary",
    },
    {
      label: "Owners",
      value: dashboard.totalOwners,
      icon: UserCheck,
      accent: "emerald",
    },
    {
      label: "Customers",
      value: dashboard.totalCustomers,
      icon: Users,
      accent: "primary",
    },
    {
      label: "Total Cars",
      value: dashboard.totalCars,
      icon: Car,
      accent: "primary",
    },
    {
      label: "Total Bookings",
      value: dashboard.totalBookings,
      icon: CalendarCheck,
      accent: "primary",
    },
    {
      label: "Pending Bookings",
      value: dashboard.pendingBookings,
      icon: Clock,
      accent: "amber",
    },
    {
      label: "Platform Revenue",
      value: formatCurrency(dashboard.totalRevenue),
      icon: DollarSign,
      accent: "gold",
    },
  ];

  const quickLinks = [
    {
      to: ROUTES.ADMIN_USERS,
      icon: Users,
      title: "Manage Users",
      desc: "View users and update roles",
    },
    {
      to: ROUTES.ADMIN_BOOKINGS,
      icon: CalendarCheck,
      title: "Manage Bookings",
      desc: "View and manage all bookings",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform-wide overview
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </motion.div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickLinks.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 transition-colors hover:border-primary-400"
          >
            <Icon className="mb-3 h-6 w-6 text-primary-600" />
            <h3 className="font-semibold text-gray-900 dark:text-luxury-ivory">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;