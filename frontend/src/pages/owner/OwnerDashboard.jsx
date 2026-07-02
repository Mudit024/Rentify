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
    <div>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
            Owner Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your listings and earnings
          </p>
        </div>
        <Link to={ROUTES.OWNER_ADD_CAR}>
          <Button>
            <PlusCircle className="h-4 w-4" /> List a New Car
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
        <div className="mt-8 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            You have {dashboard.pendingCars} car listing
            {dashboard.pendingCars > 1 ? "s" : ""} awaiting admin approval. New
            listings go live once reviewed — usually within 24 hours.
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to={ROUTES.OWNER_CARS}
          className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-primary-400 transition-colors group"
        >
          <Car className="h-6 w-6 text-primary-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-luxury-ivory">
            Manage My Cars
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Edit, delete or add new listings
          </p>
        </Link>
        <Link
          to={ROUTES.OWNER_BOOKINGS}
          className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-primary-400 transition-colors group"
        >
          <CalendarCheck className="h-6 w-6 text-primary-600 mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-luxury-ivory">
            Manage Bookings
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Approve, reject or complete rentals
          </p>
        </Link>
      </div>
    </div>
  );
};

export default OwnerDashboard;
