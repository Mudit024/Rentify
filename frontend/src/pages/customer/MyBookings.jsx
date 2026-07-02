import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CalendarCheck } from "lucide-react";
import {
  fetchMyBookings,
  cancelMyBooking,
} from "../../redux/slices/bookingSlice.js";
import BookingCard from "../../components/booking/BookingCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import Button from "../../components/common/Button.jsx";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";

const MyBookings = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await dispatch(cancelMyBooking(id)).unwrap();
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Could not cancel booking.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          My Bookings
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Track and manage all your car rental bookings
        </p>
      </div>

      {status === "loading" && <Spinner fullPage />}

      {status === "succeeded" && list.length === 0 && (
        <div className="mt-10">
          <EmptyState
            icon={CalendarCheck}
            title="No bookings yet"
            description="Browse available cars and make your first booking."
            action={
              <Link to={ROUTES.CARS}>
                <Button>Browse Cars</Button>
              </Link>
            }
          />
        </div>
      )}

      {status === "succeeded" && list.length > 0 && (
        <div className="mt-8 space-y-4">
          {list.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              actions={
                ["pending", "approved", "confirmed"].includes(booking.bookingStatus) ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
