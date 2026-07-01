import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchOwnerCars, updateOwnerCar } from '../../redux/slices/ownerSlice.js';
import CarListingForm from '../../components/owner/CarListingForm.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { ROUTES } from '../../constants/routes.js';

const EditCar = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cars, carActionStatus } = useSelector((s) => s.owner);
  const [car, setCar] = useState(null);

  useEffect(() => {
    if (cars.length === 0) {
      dispatch(fetchOwnerCars());
    }
  }, []);

  useEffect(() => {
    const found = cars.find((c) => c._id === id);
    if (found) setCar(found);
  }, [cars, id]);

  const handleSubmit = async (data) => {
    try {
      await dispatch(updateOwnerCar({ id, carData: data })).unwrap();
      toast.success('Car updated and resubmitted for approval.');
      navigate(ROUTES.OWNER_CARS);
    } catch (err) {
      toast.error(err || 'Update failed');
    }
  };

  if (!car) return <Spinner fullPage />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">Edit Listing</h1>
      <p className="mt-1 text-sm text-gray-500 mb-8">Changes will re-submit the listing for admin approval.</p>
      <div className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
        <CarListingForm
          defaultValues={car}
          onSubmit={handleSubmit}
          isSubmitting={carActionStatus === 'loading'}
        />
      </div>
    </div>
  );
};

export default EditCar;
