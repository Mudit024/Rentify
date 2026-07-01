import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarCheck } from 'lucide-react';
import { fetchAllBookings } from '../../redux/slices/adminSlice.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { BOOKING_STATUS_COLORS } from '../../constants/index.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const AllBookings = () => {
  const dispatch = useDispatch();
  const { bookings, status } = useSelector((s) => s.admin);

  useEffect(() => { dispatch(fetchAllBookings()); }, [dispatch]);

  if (status === 'loading') return <Spinner fullPage />;

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">All Bookings</h1>
      <p className="mb-8 text-sm text-gray-500">{bookings.length} platform-wide booking{bookings.length !== 1 ? 's' : ''}</p>

      {bookings.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No bookings yet" description="Platform bookings will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-gray-100 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {['Car', 'Customer', 'Owner', 'Dates', 'Total', 'Booking', 'Payment'].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-luxury-ivory">{b.car?.title || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{b.user?.name}<br /><span className="text-xs">{b.user?.email}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{b.owner?.name}<br /><span className="text-xs">{b.owner?.email}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {formatDate(b.pickupDate)} →<br />{formatDate(b.returnDate)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-luxury-ivory">{formatCurrency(b.totalPrice)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.bookingStatus} colorMap={BOOKING_STATUS_COLORS} /></td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={b.paymentStatus}
                      colorMap={{
                        unpaid: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                        paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
