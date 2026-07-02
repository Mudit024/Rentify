import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Fuel, Settings2, MapPin, Heart } from 'lucide-react';
import { carIdRoute } from '../../constants/routes.js';
import { formatCurrency } from '../../utils/formatters.js';

const CarCard = ({ car, onToggleWishlist, isWishlisted = false }) => {
  const image = car.images?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-premium transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={car.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {onToggleWishlist && (
          <button
              type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(car._id);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 rounded-full bg-white/90 dark:bg-gray-900/90 p-2 backdrop-blur-sm"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-luxury-charcoal/80 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {car.transmission}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-gray-900 dark:text-luxury-ivory truncate">
            {car.title}
          </h3>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3 w-3" /> {car.location}
        </p>

        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {car.seats}
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" /> {car.fuelType}
          </span>
          <span className="flex items-center gap-1">
            <Settings2 className="h-3.5 w-3.5" /> {car.transmission}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory">
            {formatCurrency(car.pricePerDay)}
            <span className="text-xs font-normal text-gray-500"> /day</span>
          </p>
          <Link
            to={carIdRoute(car._id)}
            className="rounded-full bg-primary-600 px-4 py-2 text-xs font-medium text-white hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
