import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Car,
  CalendarCheck,
  DollarSign,
  Clock,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import { fetchOwnerDashboard } from "../../redux/slices/ownerSlice.js";
import StatCard from "../../components/common/StatCard.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import Button from "../../components/common/Button.jsx";
import { ROUTES } from "../../constants/routes.js";
import { formatCurrency } from "../../utils/formatters.js";

const OwnerDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, status } = useSelector((s) => s.owner);

  useEffect(() => {
    dispatch(fetchOwnerDashboard());
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
      label: "Total Cars",
      value: dashboard.totalCars,
      icon: Car,
      accent: "primary",
    },
    {
      label: "Approved Listings",
      value: dashboard.approvedCars,
      icon: CheckCircle,
      accent: "emerald",
    },
    {
      label: "Pending Approval",
      value: dashboard.pendingCars,
      icon: Clock,
      accent: "amber",
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
      label: "Total Earnings",
      value: formatCurrency(dashboard.totalEarnings),
      icon: DollarSign,
      accent: "gold",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-4 border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
            Owner Dashboard
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Overview of your listings and earnings
          </p>
        </div>
        <Link to={ROUTES.OWNER_ADD_CAR}>
          <Button className="rounded-full bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-premium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            <PlusCircle className="h-4.5 w-4.5" /> List a New Car
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {stats.map((stat, index) => (
          <StatCard key={`${stat.label}-${index}`} {...stat} />
        ))}
      </motion.div>

      {dashboard.pendingCars > 0 && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-4 border-l-4 border-l-amber-500">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 leading-relaxed">
            You have {dashboard.pendingCars} car listing
            {dashboard.pendingCars > 1 ? "s" : ""} awaiting admin approval. New
            listings go live once reviewed — usually within 24 hours.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          to={ROUTES.OWNER_CARS}
          className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-sm p-6 hover:shadow-premium hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3 w-fit mb-4">
              <Car className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-luxury-ivory text-lg">
              Manage My Cars
            </h3>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Edit, delete or add new listings
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-primary-500 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
            Go to listings →
          </span>
        </Link>
        <Link
          to={ROUTES.OWNER_BOOKINGS}
          className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-sm p-6 hover:shadow-premium hover:border-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 group shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-3 w-fit mb-4">
              <CalendarCheck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-luxury-ivory text-lg">
              Manage Bookings
            </h3>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Approve, reject or complete rentals
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-primary-500 group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
            Go to bookings →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default OwnerDashboard;
