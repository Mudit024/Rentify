import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MapPin, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchCarById, clearSelectedCar } from '../../redux/slices/carSlice.js';
import { createBooking, clearLastCreatedBooking } from '../../redux/slices/bookingSlice.js';
import CarGallery from '../../components/cars/CarGallery.jsx';
import CarSpecs from '../../components/cars/CarSpecs.jsx';
import BookingForm from '../../components/booking/BookingForm.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { ROUTES } from '../../constants/routes.js';
import { useAuth } from '../../hooks/useAuth.js';
import { APPROVAL_STATUS_COLORS } from '../../constants/index.js';

const CarDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCar: car, detailStatus } = useSelector((s) => s.cars);
  const { createStatus, lastCreatedBooking } = useSelector((s) => s.bookings);
  const { isAuthenticated, role } = useAuth();

  useEffect(() => {
    dispatch(fetchCarById(id));
    return () => dispatch(clearSelectedCar());
  }, [id]);

  useEffect(() => {
    if (lastCreatedBooking) {
      toast.success('Booking request sent! The owner will confirm shortly.');
      dispatch(clearLastCreatedBooking());
      navigate(ROUTES.MY_BOOKINGS);
    }
  }, [lastCreatedBooking]);

  const handleBookingSubmit = async (data) => {
    try {
      await dispatch(createBooking(data)).unwrap();
    } catch (err) {
      toast.error(err || 'Booking failed. Please try again.');
    }
  };

  if (detailStatus === 'loading') {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl2" />
        </div>
      </div>
    );
  }

  if (detailStatus === 'failed' || (!car && detailStatus === 'succeeded')) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Car not found or no longer available.</p>
        <button onClick={() => navigate(ROUTES.CARS)} className="text-sm text-primary-600 hover:underline">
          ← Back to listings
        </button>
      </div>
    );
  }

  if (!car) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-gray-500 hover:text-primary-600 flex items-center gap-1"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left col */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-8"
        >
          <CarGallery images={car.images} title={car.title} />

          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">{car.title}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" /> {car.location}
                </p>
              </div>
              {!car.isAvailable && (
                <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-300">
                  Currently Unavailable
                </span>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-gray-600 dark:text-gray-300">{car.description}</p>
          </div>

          <div>
            <h2 className="mb-4 font-display text-xl font-semibold text-gray-900 dark:text-luxury-ivory">Specifications</h2>
            <CarSpecs car={car} />
          </div>

          {/* Owner info */}
          {car.owner && (
            <div className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
              <h2 className="mb-4 font-display text-xl font-semibold text-gray-900 dark:text-luxury-ivory">Listed by</h2>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-luxury-ivory">{car.owner.name}</p>
                  {isAuthenticated && car.owner.phone && (
                    <p className="text-sm text-gray-500">{car.owner.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right col — booking form */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
          <BookingForm
            car={car}
            onSubmit={handleBookingSubmit}
            isSubmitting={createStatus === 'loading'}
            isAuthenticated={isAuthenticated}
            role={role}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CarDetails;
