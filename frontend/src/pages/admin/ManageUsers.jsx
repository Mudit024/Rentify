import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Users } from "lucide-react";

import {
  fetchAllUsers,
  updateUserRole,
} from "../../redux/slices/adminSlice.js";

import EmptyState from "../../components/common/EmptyState.jsx";
import Spinner from "../../components/common/Spinner.jsx";
import { ROLES } from "../../constants/index.js";
import { formatDate, initials } from "../../utils/formatters.js";

const ROLE_COLORS = {
  customer:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  owner:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  admin:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
};

const ManageUsers = () => {
  const dispatch = useDispatch();

  const { users, status } = useSelector((s) => s.admin);
  const { user: currentUser } = useSelector((s) => s.auth);

  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers(roleFilter || undefined));
  }, [dispatch, roleFilter]);

  const handleRoleChange = async (userId, role) => {
    if (!window.confirm(`Change this user's role to "${role}"?`)) return;

    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error(err || "Role update failed");
    }
  };

  if (status === "loading") return <Spinner fullPage />;

  if (status === "failed") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Failed to load users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
        <h1 className="font-display text-3.5xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          Manage Users
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          {users.length} registered account{users.length !== 1 ? "s" : ""} on the platform
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {["", ...Object.values(ROLES)].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setRoleFilter(role)}
            className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              roleFilter === role
                ? "bg-primary-600 text-white shadow-premium"
                : "border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-primary-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 bg-white/50 dark:bg-luxury-deep/50 shadow-sm"
            }`}
          >
            {role
              ? role.charAt(0).toUpperCase() + role.slice(1) + "s"
              : "All Users"}
          </button>
        ))}
      </div>

      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different filter."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800/80 bg-white/70 dark:bg-luxury-deep/70 backdrop-blur-md shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800/80">
              <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                <tr>
                  {["User", "Email", "Role", "Provider", "Joined", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-gray-400"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/20"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 shadow-inner">
                          {user.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt={user.name}
                              className="h-full w-full rounded-xl object-cover"
                            />
                          ) : (
                            initials(user.name)
                          )}
                        </div>

                        <span className="text-sm font-bold text-gray-900 dark:text-luxury-ivory">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                          ROLE_COLORS[user.role]
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold capitalize text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {user.authProvider}
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {user._id !== currentUser?._id && (
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="rounded-xl border border-gray-200 bg-white dark:bg-luxury-deep px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/40 dark:border-gray-700 shadow-sm"
                        >
                          {Object.values(ROLES).map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;