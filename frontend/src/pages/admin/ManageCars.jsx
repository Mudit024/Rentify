import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Car, MapPin, User, Trash2, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

import {
  fetchAllCars,
  blockCar,
  unblockCar,
  deleteCar,
} from "../../redux/slices/adminSlice.js";

import EmptyState from "../../components/common/EmptyState.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import Button from "../../components/common/Button.jsx";
import { formatCurrency } from "../../utils/formatters.js";

const ManageCars = () => {
  const dispatch = useDispatch();
  const { cars, status } = useSelector((s) => s.admin);

  const [filter, setFilter] = useState("all"); // 'all', 'active', 'blocked'

  useEffect(() => {
    dispatch(fetchAllCars());
  }, [dispatch]);

  const handleBlockToggle = async (car) => {
    const actionText = car.isBlocked ? "unblock" : "block";
    if (!window.confirm(`Are you sure you want to ${actionText} this car listing?`)) return;

    try {
      if (car.isBlocked) {
        await dispatch(unblockCar(car._id)).unwrap();
        toast.success("Car listing unblocked successfully");
      } else {
        await dispatch(blockCar(car._id)).unwrap();
        toast.success("Car listing blocked successfully");
      }
    } catch (err) {
      toast.error(err || `${actionText === "block" ? "Blocking" : "Unblocking"} failed`);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Permanently delete this car listing? This cannot be undone.")) return;

    try {
      await dispatch(deleteCar(carId)).unwrap();
      toast.success("Car listing deleted successfully");
    } catch (err) {
      toast.error(err || "Delete failed");
    }
  };

  if (status === "loading") return <Spinner fullPage />;

  if (status === "failed") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Failed to load cars.</p>
      </div>
    );
  }

  const filteredCars = cars.filter((car) => {
    if (filter === "active") return !car.isBlocked && !car.isDeleted;
    if (filter === "blocked") return car.isBlocked && !car.isDeleted;
    return !car.isDeleted;
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
        Manage Cars
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        {filteredCars.length} car{filteredCars.length !== 1 ? "s" : ""} showing
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: "all", label: "All Cars" },
          { value: "active", label: "Active" },
          { value: "blocked", label: "Blocked" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === opt.value
                ? "bg-primary-600 text-white"
                : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredCars.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No cars found"
          description="There are no cars matching your filter selection."
        />
      ) : (
        <div className="space-y-5">
          {filteredCars.map((car, i) => {
            const image =
              car.images?.[0]?.url ||
              "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80";
            return (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <img
                    src={image}
                    alt={car.title}
                    className="h-40 w-full sm:w-48 object-cover shrink-0"
                  />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-luxury-ivory">
                            {car.title}
                          </h3>
                          {car.isBlocked && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {car.brand} {car.model} · {car.year} · {car.color}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-luxury-ivory">
                        {formatCurrency(car.pricePerDay)}/day
                      </p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {car.location}
                      </span>
                      <span>
                        {car.transmission} · {car.fuelType} · {car.seats} seats
                      </span>
                      {car.owner && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {car.owner.name} ({car.owner.email})
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {car.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={car.isBlocked ? "primary" : "outline"}
                        onClick={() => handleBlockToggle(car)}
                      >
                        {car.isBlocked ? (
                          <>
                            <Unlock className="h-3.5 w-3.5" /> Unblock Listing
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" /> Block Listing
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(car._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageCars;
