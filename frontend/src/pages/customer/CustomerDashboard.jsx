import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Heart, Car, IndianRupee, ArrowRight, ShieldCheck, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import bookingService from "../../services/bookingService.js";
import { userService } from "../../services/userService.js";
import { formatCurrency, isPastDate } from "../../utils/formatters.js";
import { ROUTES } from "../../constants/routes.js";
import Button from "../../components/common/Button.jsx";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    wishlistCount: 0,
    totalSpent: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookings, wishlist] = await Promise.all([
          bookingService.getMyBookings(),
          userService.getWishlist(),
        ]);

        const rawList = bookings || [];
        const bookingsList = rawList.filter(
          (b) => !(b.bookingStatus === "pending" && isPastDate(b.pickupDate))
        );
        const wishlistList = wishlist || [];

        const totalSpent = bookingsList.reduce((sum, b) => {
          if (b.bookingStatus === "confirmed" || b.bookingStatus === "completed") {
            return sum + (b.totalPrice || 0);
          }
          return sum;
        }, 0);

        const activeCount = bookingsList.filter((b) => b.bookingStatus === "confirmed").length;

        setStats({
          totalBookings: bookingsList.length,
          activeBookings: activeCount,
          wishlistCount: wishlistList.length,
          totalSpent,
        });

        setRecentBookings(bookingsList.slice(0, 3));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          Welcome back, {user?.name || "Renter"} 👋
        </h1>
        <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Here is an overview of your Rentify profile and activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            name: "Total Bookings",
            value: stats.totalBookings,
            icon: Calendar,
            bg: "bg-blue-50 dark:bg-blue-950/20",
            textColor: "text-blue-600 dark:text-blue-400",
          },
          {
            name: "Active Rentals",
            value: stats.activeBookings,
            icon: Car,
            bg: "bg-green-50 dark:bg-green-950/20",
            textColor: "text-green-600 dark:text-green-400",
          },
          {
            name: "Wishlisted Cars",
            value: stats.wishlistCount,
            icon: Heart,
            bg: "bg-rose-50 dark:bg-rose-950/20",
            textColor: "text-rose-600 dark:text-rose-400",
          },
          {
            name: "Total Spent",
            value: formatCurrency(stats.totalSpent),
            icon: IndianRupee,
            bg: "bg-amber-50 dark:bg-amber-950/20",
            textColor: "text-amber-600 dark:text-amber-400",
          },
        ].map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-2xl border border-gray-150 dark:border-gray-800/80 bg-white dark:bg-luxury-deep p-6 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {item.name}
              </p>
              <h3 className="font-display text-2.5xl font-black text-gray-900 dark:text-luxury-ivory leading-none">
                {item.value}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${item.bg} ${item.textColor}`}>
              <item.icon className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Bookings & Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Side: Recent Bookings & Actions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Bookings */}
          <div className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-luxury-deep p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory">
                Recent Bookings
              </h3>
              <Link
                to={ROUTES.MY_BOOKINGS}
                className="flex items-center gap-1 text-xs font-bold text-primary-500 hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  You haven't made any bookings yet.
                </p>
                <Link to={ROUTES.CARS}>
                  <Button variant="outline" className="mt-3" size="sm">
                    Book your first car
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentBookings.map((b) => (
                  <div key={b._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm text-gray-900 dark:text-luxury-ivory">
                        {b.car?.brand} {b.car?.model}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                        {new Date(b.pickupDate).toDateString()} to {new Date(b.returnDate).toDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900 dark:text-luxury-ivory">
                        {formatCurrency(b.totalPrice)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold capitalize border ${
                          b.bookingStatus === "confirmed"
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30"
                            : b.bookingStatus === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30"
                            : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/20 dark:text-gray-400 dark:border-gray-900/30"
                        }`}
                      >
                        {b.bookingStatus === "confirmed" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : b.bookingStatus === "pending" ? (
                          <Clock className="h-3 w-3" />
                        ) : null}
                        {b.bookingStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to={ROUTES.CARS}
              className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white hover:bg-gray-50 dark:bg-luxury-deep dark:hover:bg-luxury-deep/60 p-5 shadow-sm space-y-2 group transition-all duration-300"
            >
              <div className="p-3 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-xl w-fit">
                <Car className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-gray-900 dark:text-luxury-ivory group-hover:text-primary-500 transition-colors">
                Browse Cars
              </h4>
              <p className="text-xs font-semibold text-gray-400 leading-normal">
                Explore our catalog of premium certified vehicles.
              </p>
            </Link>

            <Link
              to={ROUTES.MY_BOOKINGS}
              className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white hover:bg-gray-50 dark:bg-luxury-deep dark:hover:bg-luxury-deep/60 p-5 shadow-sm space-y-2 group transition-all duration-300"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl w-fit">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-gray-900 dark:text-luxury-ivory group-hover:text-primary-500 transition-colors">
                View Rentals
              </h4>
              <p className="text-xs font-semibold text-gray-400 leading-normal">
                Track status, approvals, and keys retrieval info.
              </p>
            </Link>

            <Link
              to={ROUTES.WISHLIST}
              className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white hover:bg-gray-50 dark:bg-luxury-deep dark:hover:bg-luxury-deep/60 p-5 shadow-sm space-y-2 group transition-all duration-300"
            >
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl w-fit">
                <Heart className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-sm text-gray-955 dark:text-luxury-ivory group-hover:text-primary-500 transition-colors">
                Car Wishlist
              </h4>
              <p className="text-xs font-semibold text-gray-400 leading-normal">
                Review and book the cars you've marked as favorites.
              </p>
            </Link>
          </div>

        </div>

        {/* Right Side: Driving Info & Rewards */}
        <div className="space-y-8">
          
          {/* Driving Instructions Card */}
          <div className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-luxury-deep p-6 shadow-sm space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory">
                Renter Checklist 📋
              </h3>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">
                Keep these guidelines in mind for a smooth ride.
              </p>
            </div>

            <ul className="space-y-3 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 shrink-0 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-500 flex items-center justify-center font-bold">1</span>
                <span>Carry your original, physical **Driving License (DL)** during vehicle collection.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 shrink-0 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-500 flex items-center justify-center font-bold">2</span>
                <span>Conduct a full walk-around inspection and take photos of the car before driving away.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 shrink-0 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-500 flex items-center justify-center font-bold">3</span>
                <span>Report any preexisting damages immediately to the host via the chat portal.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 shrink-0 rounded-full bg-primary-50 dark:bg-primary-950/20 text-primary-500 flex items-center justify-center font-bold">4</span>
                <span>Return the car with the same fuel level as recorded during pickup.</span>
              </li>
            </ul>
          </div>

          {/* Verification Banner */}
          <div className="rounded-2xl border border-primary-100 dark:border-primary-950/20 bg-primary-50/20 dark:bg-primary-950/5 p-5 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-primary-500 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-gray-955 dark:text-luxury-ivory leading-none">
                Verified Renter Profile
              </h4>
              <p className="text-xs font-semibold text-gray-500 leading-normal">
                Your profile is active, registered, and verified. You are authorized to rent cars across all regions.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
