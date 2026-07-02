import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CalendarCheck } from "lucide-react";
import {
  fetchOwnerBookings,
  updateOwnerBookingStatus,
} from "../../redux/slices/ownerSlice.js";

import EmptyState from "../../components/common/EmptyState.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import Button from "../../components/common/Button.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { BOOKING_STATUS_COLORS } from "../../constants/index.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";

const OwnerBookings = () => {
  const dispatch = useDispatch();
  const { bookings, status } = useSelector((s) => s.owner);

  useEffect(() => {
    dispatch(fetchOwnerBookings());
  }, [dispatch]);

  const updateStatus = async (id, bookingStatus, paymentStatus) => {
    try {
      await dispatch(
        updateOwnerBookingStatus({
          id,
          payload: { bookingStatus, paymentStatus },
        }),
      ).unwrap();
      toast.success(`Booking ${bookingStatus}`);
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Unable to update booking.",
      );
    }
  };

  if (status === "loading" && bookings.length === 0) {
    return <Spinner fullPage />;
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          Booking Requests
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {bookings.length} active rental request{bookings.length !== 1 ? "s" : ""} on your cars
        </p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Bookings from customers will appear here once you have approved listings."
        />
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const customer = booking.user || {};
            return (
              <div
                key={booking._id}
                className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-premium transition-all duration-300"
              >
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-luxury-ivory text-lg">
                      {booking.car?.title || "Car Rental Request"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                      Renter: <span className="font-semibold text-gray-700 dark:text-gray-200">{customer.name}</span> ({customer.email})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={booking.bookingStatus}
                      colorMap={BOOKING_STATUS_COLORS}
                    />
                    {booking.paymentStatus && (
                      <StatusBadge
                        status={booking.paymentStatus}
                        colorMap={{
                          unpaid:
                            "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                          paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 border-t border-b border-gray-100/50 dark:border-gray-800/50 py-3.5 my-4">
                  <span className="flex items-center gap-1.5">
                    📅 {formatDate(booking.pickupDate)} → {formatDate(booking.returnDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    📍 {booking.pickupLocation}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-luxury-ivory">
                    Total: {formatCurrency(booking.totalPrice)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {booking.bookingStatus === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="rounded-xl px-5 py-2.5 font-bold shadow-sm"
                        onClick={() => updateStatus(booking._id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="rounded-xl px-5 py-2.5 font-bold shadow-sm"
                        onClick={() => updateStatus(booking._id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {booking.bookingStatus === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl px-5 py-2.5 font-bold shadow-sm"
                      onClick={() => updateStatus(booking._id, "completed")}
                    >
                      Mark Completed
                    </Button>
                  )}
                  {booking.paymentStatus === "unpaid" &&
                    ["approved", "completed"].includes(
                      booking.bookingStatus,
                    ) && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl px-4 py-2.5 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20"
                        onClick={() =>
                          updateStatus(
                            booking._id,
                            booking.bookingStatus,
                            "paid",
                          )
                        }
                      >
                        Mark Paid
                      </Button>
                    )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
