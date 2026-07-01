import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ShieldCheck, MapPin, User, Check, X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  fetchPendingCars,
  approveCarListing,
  rejectCarListing,
  adminDeleteCarListing,
} from '../../redux/slices/adminSlice.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import { formatCurrency } from '../../utils/formatters.js';

const ApproveListings = () => {
  const dispatch = useDispatch();
  const { pendingCars, status } = useSelector((s) => s.admin);
  const [rejectModal, setRejectModal] = useState(null); // car object to reject
  const [reason, setReason] = useState('');

  useEffect(() => { dispatch(fetchPendingCars()); }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(approveCarListing(id)).unwrap();
      toast.success('Listing approved and now live');
    } catch (err) { toast.error(err || 'Approval failed'); }
  };

  const handleReject = async () => {
    if (!reason.trim()) { toast.error('Rejection reason required'); return; }
    try {
      await dispatch(rejectCarListing({ id: rejectModal._id, rejectionReason: reason })).unwrap();
      toast.success('Listing rejected');
      setRejectModal(null);
      setReason('');
    } catch (err) { toast.error(err || 'Rejection failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this listing?')) return;
    try {
      await dispatch(adminDeleteCarListing(id)).unwrap();
      toast.success('Listing deleted');
    } catch (err) { toast.error(err || 'Delete failed'); }
  };

  if (status === 'loading') return <Spinner fullPage />;

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">Listing Approvals</h1>
      <p className="mb-8 text-sm text-gray-500">{pendingCars.length} pending listing{pendingCars.length !== 1 ? 's' : ''}</p>

      {pendingCars.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="All caught up!" description="No listings are pending review right now." />
      ) : (
        <div className="space-y-5">
          {pendingCars.map((car, i) => {
            const image = car.images?.[0]?.url || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80';
            return (
              <motion.div
                key={car._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <img src={image} alt={car.title} className="h-40 w-full sm:w-48 object-cover shrink-0" />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-luxury-ivory">{car.title}</h3>
                        <p className="text-sm text-gray-500">{car.brand} {car.model} · {car.year} · {car.color}</p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-luxury-ivory">{formatCurrency(car.pricePerDay)}/day</p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{car.location}</span>
                      <span>{car.transmission} · {car.fuelType} · {car.seats} seats</span>
                      {car.owner && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />{car.owner.name} ({car.owner.email})
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{car.description}</p>

                    {car.images?.length > 1 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto">
                        {car.images.slice(1, 5).map((img, j) => (
                          <img key={j} src={img.url} className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => handleApprove(car._id)}>
                        <Check className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setRejectModal(car)}>
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(car._id)}>
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

      <Modal isOpen={!!rejectModal} onClose={() => { setRejectModal(null); setReason(''); }} title="Reject Listing">
        <p className="mb-4 text-sm text-gray-500">
          Provide a reason for rejecting <strong>{rejectModal?.title}</strong>. This will be shown to the owner.
        </p>
        <Input
          label="Rejection Reason"
          placeholder="e.g. Images are too blurry, price is unrealistic..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setRejectModal(null); setReason(''); }}>Cancel</Button>
          <Button variant="danger" onClick={handleReject}>Reject Listing</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ApproveListings;
