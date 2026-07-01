import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Users } from 'lucide-react';
import { fetchAllUsers, updateUserRoleThunk } from '../../redux/slices/adminSlice.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import Button from '../../components/common/Button.jsx';
import { ROLES } from '../../constants/index.js';
import { formatDate, initials } from '../../utils/formatters.js';

const ROLE_COLORS = {
  customer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  owner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((s) => s.admin);
  const { user: currentUser } = useSelector((s) => s.auth);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => { dispatch(fetchAllUsers(roleFilter || undefined)); }, [roleFilter]);

  const handleRoleChange = async (userId, role) => {
    if (!window.confirm(`Change this user's role to "${role}"?`)) return;
    try {
      await dispatch(updateUserRoleThunk({ id: userId, role })).unwrap();
      toast.success(`Role updated to ${role}`);
    } catch (err) { toast.error(err || 'Role update failed'); }
  };

  if (status === 'loading') return <Spinner fullPage />;

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">Manage Users</h1>
      <p className="mb-6 text-sm text-gray-500">{users.length} user{users.length !== 1 ? 's' : ''}</p>

      {/* Role filter tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['', ...Object.values(ROLES)].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              roleFilter === r
                ? 'bg-primary-600 text-white'
                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {r ? r.charAt(0).toUpperCase() + r.slice(1) + 's' : 'All Users'}
          </button>
        ))}
      </div>

      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try a different filter." />
      ) : (
        <div className="overflow-hidden rounded-xl2 border border-gray-100 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {['User', 'Email', 'Role', 'Provider', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-xs font-semibold text-primary-700">
                        {u.avatar?.url ? <img src={u.avatar.url} className="h-full w-full rounded-full object-cover" /> : initials(u.name)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-luxury-ivory">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{u.authProvider}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    {u._id !== currentUser?.id && (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/40"
                      >
                        {Object.values(ROLES).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    )}
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

export default ManageUsers;
