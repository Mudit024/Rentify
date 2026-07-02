import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { CalendarDays, MapPin } from "lucide-react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { calculateDays, formatCurrency } from "../../utils/formatters.js";
import { ROUTES } from "../../constants/routes.js";
import { ROLES } from "../../constants/index.js";

const BookingForm = ({
  car,
  onSubmit,
  isSubmitting,
  isAuthenticated,
  role,
}) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pickupDate: "",
      returnDate: "",
      pickupLocation: car.location,
    },
  });

  const pickupDate = watch("pickupDate");
  const returnDate = watch("returnDate");

  const days = useMemo(
    () => calculateDays(pickupDate, returnDate),
    [pickupDate, returnDate],
  );
  const total = days * car.pricePerDay;

  const handleFormSubmit = async (data) => {
    if (!isAuthenticated) {
      toast.error("Please log in to book this car");
      navigate(ROUTES.LOGIN);
      return;
    }
    if (role === ROLES.OWNER || role === ROLES.ADMIN) {
      toast.error("Only customer accounts can book cars");
      return;
    }
    if (days <= 0) {
      toast.error("Return date must be after pickup date");
      return;
    }
    try {
      await onSubmit({ car: car._id, ...data });
    } catch (err) {
      toast.error(
        err?.message || 'Unable to create booking.'
      );
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="sticky top-24 space-y-4 rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-premium"
    >
      <p className="font-display text-2xl font-bold text-gray-900 dark:text-luxury-ivory">
        {formatCurrency(car.pricePerDay)}
        <span className="text-sm font-normal text-gray-500"> / day</span>
      </p>

      <Input
        label="Pickup Date"
        type="date"
        min={today}
        icon={CalendarDays}
        error={errors.pickupDate?.message}
        {...register("pickupDate", { required: "Pickup date is required" })}
      />
      <Input
        label="Return Date"
        type="date"
        min={pickupDate || today}
        icon={CalendarDays}
        error={errors.returnDate?.message}
        {...register("returnDate", { required: "Return date is required" })}
      />
      <Input
        label="Pickup Location"
        icon={MapPin}
        error={errors.pickupLocation?.message}
        {...register("pickupLocation", {
          required: "Pickup location is required",
        })}
      />

      {days > 0 && (
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>
              {formatCurrency(car.pricePerDay)} × {days} day
              {days > 1 ? "s" : ""}
            </span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-semibold text-gray-900 dark:text-luxury-ivory">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        loading={isSubmitting}
        disabled={!car.isAvailable}
      >
        {car.isAvailable ? "Book Now" : "Currently Unavailable"}
      </Button>
    </form>
  );
};

export default BookingForm;
