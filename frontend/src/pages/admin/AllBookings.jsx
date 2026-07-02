import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarCheck } from "lucide-react";

import { fetchAllBookings } from "../../redux/slices/adminSlice.js";
import EmptyState from "../../components/common/EmptyState.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { BOOKING_STATUS_COLORS } from "../../constants/index.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const paymentColors = {
  unpaid: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const AllBookings = () => {
  const dispatch = useDispatch();
  const { bookings, status } = useSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  if (status === "loading") {
    return <Spinner fullPage />;
  }

  if (status === "failed") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Failed to load bookings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          All Bookings
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {bookings.length} platform-wide booking{bookings.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Platform bookings will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-md shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800/80">
              <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                <tr>
                  {[
                    "Car",
                    "Customer",
                    "Owner",
                    "Dates",
                    "Total",
                    "Booking",
                    "Payment",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-luxury-ivory whitespace-nowrap">
                      {booking.car?.title || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <p className="text-gray-900 dark:text-luxury-ivory">{booking.user?.name || "—"}</p>
                      <p className="text-xs font-medium text-gray-400 mt-0.5">{booking.user?.email}</p>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      <p className="text-gray-900 dark:text-luxury-ivory">{booking.owner?.name || "—"}</p>
                      <p className="text-xs font-medium text-gray-400 mt-0.5">{booking.owner?.email}</p>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                      {formatDate(booking.pickupDate)}
                      <br />
                      {formatDate(booking.returnDate)}
                    </td>

                    <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-luxury-ivory whitespace-nowrap">
                      {formatCurrency(booking.totalPrice)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={booking.bookingStatus}
                        colorMap={BOOKING_STATUS_COLORS}
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.paymentStatus && (
                        <StatusBadge
                          status={booking.paymentStatus}
                          colorMap={paymentColors}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;