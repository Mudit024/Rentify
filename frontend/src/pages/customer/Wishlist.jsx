import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService.js";
import CarCard from "../../components/cars/CarCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import Button from "../../components/common/Button.jsx";
import { ROUTES } from "../../constants/routes.js";

const Wishlist = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getWishlist()
      .then((res) => setCars(res))
      .catch(() => toast.error("Could not load wishlist"))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (carId) => {
    try {
      await userService.removeFromWishlist(carId);
      setCars((prev) => prev.filter((c) => (c._id || c) !== carId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err?.message || "Could not remove from wishlist.");
    }
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          My Wishlist
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {cars.length} saved premium car{cars.length !== 1 ? "s" : ""}
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save cars you love while browsing."
            action={
              <Link to={ROUTES.CARS}>
                <Button>Browse Cars</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cars.map((car) => (
            <CarCard
              key={car._id}
              car={car}
              isWishlisted
              onToggleWishlist={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
