import { MapPin, CalendarDays } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
import { BOOKING_STATUS_COLORS } from '../../constants/index.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const BookingCard = ({ booking, actions }) => {
  const car = booking.car || {};
  const image = car.images?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="flex flex-col gap-4 rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:flex-row sm:items-center">
      <img src={image} alt={car.title} className="h-24 w-full rounded-xl object-cover sm:w-32" />

      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-display font-semibold text-gray-900 dark:text-luxury-ivory">{car.title || 'Car'}</h4>
          <StatusBadge status={booking.bookingStatus} colorMap={BOOKING_STATUS_COLORS} />
        </div>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(booking.pickupDate)} – {formatDate(booking.returnDate)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {booking.pickupLocation}
          </span>
        </div>
        <p className="mt-2 font-semibold text-gray-900 dark:text-luxury-ivory">{formatCurrency(booking.totalPrice)}</p>
      </div>

      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  );
};

export default BookingCard;
