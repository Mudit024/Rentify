import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOwnerCar } from '../../redux/slices/ownerSlice.js';
import CarListingForm from '../../components/owner/CarListingForm.jsx';
import { ROUTES } from '../../constants/routes.js';

const AddCar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { carActionStatus } = useSelector((s) => s.owner);

  const handleSubmit = async (data) => {
    try {
      await dispatch(createOwnerCar(data)).unwrap();
      toast.success('Car listed! Pending admin approval.');
      navigate(ROUTES.OWNER_CARS);
    } catch (err) {
      toast.error(err || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">List a New Car</h1>
      <p className="mt-1 text-sm text-gray-500 mb-8">Fill in the details below. Your listing will be reviewed before going live.</p>
      <div className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
        <CarListingForm
          onSubmit={handleSubmit}
          isSubmitting={carActionStatus === 'loading'}
        />
      </div>
    </div>
  );
};

export default AddCar;
