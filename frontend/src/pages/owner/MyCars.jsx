import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PlusCircle, Pencil, Trash2, Car } from 'lucide-react';
import { fetchOwnerCars, deleteOwnerCar } from '../../redux/slices/ownerSlice.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Button from '../../components/common/Button.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { ROUTES, ownerEditCarRoute } from '../../constants/routes.js';
import { APPROVAL_STATUS_COLORS } from '../../constants/index.js';
import { formatCurrency } from '../../utils/formatters.js';

const MyCars = () => {
  const dispatch = useDispatch();
  const { cars, status } = useSelector((s) => s.owner);

  useEffect(() => { dispatch(fetchOwnerCars()); }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    try {
      await dispatch(deleteOwnerCar(id)).unwrap();
      toast.success('Car deleted');
    } catch (err) {
      toast.error(err || 'Delete failed');
    }
  };

  if (status === 'loading') return <Spinner fullPage />;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">My Cars</h1>
          <p className="mt-1 text-sm text-gray-500">{cars.length} listing{cars.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to={ROUTES.OWNER_ADD_CAR}>
          <Button><PlusCircle className="h-4 w-4" /> Add New Car</Button>
        </Link>
      </div>

      {cars.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No cars listed yet"
          description="List your first car and start earning."
          action={<Link to={ROUTES.OWNER_ADD_CAR}><Button>List a Car</Button></Link>}
        />
      ) : (
        <div className="space-y-4">
          {cars.map((car) => {
            const image = car.images?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80';
            return (
              <div
                key={car._id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
              >
                <img src={image} alt={car.title} className="h-20 w-full sm:w-28 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-luxury-ivory truncate">{car.title}</h3>
                    <StatusBadge status={car.approvalStatus} colorMap={APPROVAL_STATUS_COLORS} />
                    {!car.isAvailable && (
                      <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500">Unavailable</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">{car.brand} {car.model} · {car.location}</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-luxury-ivory">{formatCurrency(car.pricePerDay)}<span className="text-xs font-normal text-gray-500"> /day</span></p>
                  {car.approvalStatus === 'rejected' && car.rejectionReason && (
                    <p className="mt-1 text-xs text-red-500">Rejected: {car.rejectionReason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={ownerEditCarRoute(car._id)}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(car._id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCars;
