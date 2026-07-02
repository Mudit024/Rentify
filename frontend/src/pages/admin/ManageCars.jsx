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
    <div className="space-y-8">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          Manage Cars
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {filteredCars.length} car listing{filteredCars.length !== 1 ? "s" : ""} on the platform
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {[
          { value: "all", label: "All Cars" },
          { value: "active", label: "Active" },
          { value: "blocked", label: "Blocked" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              filter === opt.value
                ? "bg-primary-600 text-white shadow-premium"
                : "border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-primary-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 bg-white/50 dark:bg-luxury-deep/50 shadow-sm"
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
                className="rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-sm shadow-sm hover:shadow-premium hover:border-primary-500/20 transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <img
                    src={image}
                    alt={car.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80";
                    }}
                    className="h-44 w-full md:w-56 object-cover shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800"
                  />
                  <div className="flex-1 p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory">
                            {car.title}
                          </h3>
                          {car.isBlocked && (
                            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/30">
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
                          {car.brand} {car.model} · {car.year} · {car.color}
                        </p>
                      </div>
                      <p className="font-extrabold text-gray-900 dark:text-luxury-ivory text-xl">
                        {formatCurrency(car.pricePerDay)}
                        <span className="text-xs font-normal text-gray-500"> /day</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-gray-500 dark:text-gray-400 border-t border-b border-gray-150/50 dark:border-gray-800/50 py-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary-500" />
                        {car.location}
                      </span>
                      <span>
                        {car.transmission} · {car.fuelType} · {car.seats} seats
                      </span>
                      {car.owner && (
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-primary-500" />
                          Owner: {car.owner.name} ({car.owner.email})
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                      {car.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        variant={car.isBlocked ? "primary" : "outline"}
                        className="rounded-xl px-4 py-2 font-bold shadow-sm"
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
                        className="rounded-xl px-4 py-2 font-bold shadow-sm"
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
