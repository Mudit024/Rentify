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
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
        Booking Requests
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        {bookings.length} booking{bookings.length !== 1 ? "s" : ""} on your cars
      </p>

      {bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title="No bookings yet"
          description="Bookings from customers will appear here once you have approved listings."
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const customer = booking.user || {};
            return (
              <div
                key={booking._id}
                className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
              >
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-luxury-ivory">
                      {booking.car?.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Customer: {customer.name} · {customer.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={booking.bookingStatus}
                      colorMap={BOOKING_STATUS_COLORS}
                    />
                    <StatusBadge
                      status={booking.paymentStatus}
                      colorMap={{
                        unpaid:
                          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                        paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 mb-4">
                  <span>
                    📅 {formatDate(booking.pickupDate)} →{" "}
                    {formatDate(booking.returnDate)}
                  </span>
                  <span>📍 {booking.pickupLocation}</span>
                  <span className="font-semibold text-gray-900 dark:text-luxury-ivory">
                    {formatCurrency(booking.totalPrice)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {booking.bookingStatus === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => updateStatus(booking._id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
