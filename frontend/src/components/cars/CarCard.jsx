import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Fuel, Settings2, MapPin, Heart } from 'lucide-react';
import { carIdRoute } from '../../constants/routes.js';
import { formatCurrency } from '../../utils/formatters.js';

const CarCard = ({ car, onToggleWishlist, isWishlisted = false }) => {
  const image = car.images?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-luxury-deep shadow-sm hover:shadow-premium transition-all"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={car.title}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80";
          }}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
        />
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(car._id);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3.5 top-3.5 rounded-full bg-white/90 dark:bg-luxury-deep/90 p-2.5 backdrop-blur-md shadow-md hover:scale-110 active:scale-90 transition-all duration-200"
          >
            <Heart className={`h-4.5 w-4.5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500 dark:text-gray-400'}`} />
          </button>
        )}
        <div className="absolute left-3.5 top-3.5 rounded-lg bg-luxury-charcoal/80 dark:bg-primary-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
          {car.transmission}
        </div>
      </div>

      <div className="p-5">
        <div>
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory truncate group-hover:text-primary-500 transition-colors">
            {car.title}
          </h3>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
          <MapPin className="h-3.5 w-3.5 text-primary-500" /> {car.location}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-b border-gray-100 dark:border-gray-800/80 py-3 my-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary-500" /> {car.seats} Seats
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-4 w-4 text-primary-500" /> {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Settings2 className="h-4 w-4 text-primary-500" /> {car.transmission}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-display text-xl font-extrabold text-gray-900 dark:text-luxury-ivory">
            {formatCurrency(car.pricePerDay)}
            <span className="text-xs font-medium text-gray-500"> /day</span>
          </p>
          <Link
            to={carIdRoute(car._id)}
            className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-xs font-bold text-white shadow-premium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
