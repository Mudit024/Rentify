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
    <div>
      <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
        Manage Users
      </h1>

      <p className="mb-6 text-sm text-gray-500">
        {users.length} user{users.length !== 1 ? "s" : ""}
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {["", ...Object.values(ROLES)].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              roleFilter === role
                ? "bg-primary-600 text-white"
                : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
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
        <div className="overflow-hidden rounded-xl2 border border-gray-100 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {["User", "Email", "Role", "Provider", "Joined", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/30">
                        {user.avatar?.url ? (
                          <img
                            src={user.avatar.url}
                            alt={user.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          initials(user.name)
                        )}
                      </div>

                      <span className="text-sm font-medium text-gray-900 dark:text-luxury-ivory">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.email}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        ROLE_COLORS[user.role]
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs capitalize text-gray-500">
                    {user.authProvider}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    {user._id !== currentUser?._id && (
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="rounded-lg border border-gray-200 bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/40 dark:border-gray-700"
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
      )}
    </div>
  );
};

export default ManageUsers;