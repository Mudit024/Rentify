import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchCars,
  setFilters,
  resetFilters,
} from "../../redux/slices/carSlice.js";
import { userService } from "../../services/userService.js";
import CarCard from "../../components/cars/CarCard.jsx";
import CarFilters from "../../components/cars/CarFilters.jsx";
import { CarGridSkeleton } from "../../components/common/Skeleton.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Button from "../../components/common/Button.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";
import { usePagination } from "../../hooks/usePagination.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Car } from "lucide-react";
import { ROUTES } from "../../constants/routes.js";

const CarListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    list: cars,
    status,
    pagination,
    filters,
  } = useSelector((s) => s.cars);
  const { user, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "owner") {
        navigate(ROUTES.OWNER_DASHBOARD, { replace: true });
      } else if (role === "admin") {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const debouncedQ = useDebounce(filters.q, 400);
  const debouncedLocation = useDebounce(filters.location, 400);
  const { page, goToPage, reset } = usePagination(1);

  // Seed search query from URL on first load
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) dispatch(setFilters({ q }));
  }, []);

  useEffect(() => {
    reset();
  }, [
    debouncedQ,
    debouncedLocation,
    filters.brand,
    filters.fuelType,
    filters.transmission,
    filters.seats,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
  ]);

  useEffect(() => {
    dispatch(
      fetchCars({
        ...filters,
        q: debouncedQ,
        location: debouncedLocation,
        page,
      }),
    );
  }, [
    debouncedQ,
    debouncedLocation,
    filters.brand,
    filters.fuelType,
    filters.transmission,
    filters.seats,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    page,
  ]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "customer") return;

    const loadWishlist = async () => {
      try {
        const res = await userService.getWishlist();
        setWishlist(res.map((car) => car._id));
      } catch (err) {
        console.error(err);
      }
    };

    loadWishlist();
  }, [isAuthenticated, user]);

  const handleFilterChange = useCallback(
    (update) => {
      dispatch(setFilters(update));
    },
    [dispatch],
  );

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
    reset();
  }, [dispatch]);

  const handleToggleWishlist = async (carId) => {
    if (!isAuthenticated) return;
    try {
      if (wishlist.includes(carId)) {
        await userService.removeFromWishlist(carId);
        setWishlist((prev) => prev.filter((id) => id !== carId));
      } else {
        await userService.addToWishlist(carId);
        setWishlist((prev) => [...prev, carId]);
      }
    } catch {}
  };

  const FiltersPanel = (
    <CarFilters
      filters={filters}
      onChange={handleFilterChange}
      onReset={handleReset}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
            Browse Cars
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {status === "succeeded"
              ? `${pagination.total} car${pagination.total !== 1 ? "s" : ""} available`
              : "Finding available cars…"}
          </p>
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 lg:block">{FiltersPanel}</aside>

        {/* Mobile filters drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-white dark:bg-gray-900 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-luxury-ivory">
                    Filters
                  </h3>
                  <button onClick={() => setMobileFiltersOpen(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                {FiltersPanel}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Car grid */}
        <div className="flex-1">
          {status === "loading" ? (
            <CarGridSkeleton count={9} />
          ) : cars.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No cars found"
              description="Try adjusting your filters or search terms."
              action={
                <Button variant="outline" onClick={handleReset}>
                  Reset Filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {cars.map((car) => (
                  <CarCard
                    key={car._id}
                    car={car}
                    onToggleWishlist={
                      isAuthenticated && user?.role === "customer"
                        ? handleToggleWishlist
                        : undefined
                    }
                    isWishlisted={wishlist.includes(car._id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                     type="button"
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-primary-600 text-white"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarListing;
