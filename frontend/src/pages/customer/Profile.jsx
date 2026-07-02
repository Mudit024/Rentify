import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Phone, Shield } from "lucide-react";
import { fetchCurrentUser } from "../../redux/slices/authSlice.js";
import { userService } from "../../services/userService.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { initials } from "../../utils/formatters.js";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name,
      phone: user.phone || "",
    });
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await userService.updateProfile(data);
      await dispatch(fetchCurrentUser());
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Profile update failed.",
      );
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
        My Profile
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your personal information
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8"
      >
        {/* Avatar */}
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-2xl font-bold text-primary-700 dark:text-primary-300">
            {user.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials(user.name)
            )}
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-gray-900 dark:text-luxury-ivory">
              {user.name}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-50 dark:bg-primary-900/30 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300 capitalize">
              <Shield className="h-3 w-3" /> {user.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Full Name"
            icon={User}
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Too short" },
            })}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">{user.email}</span>
              <span className="ml-auto text-xs text-gray-400">
                Cannot change
              </span>
            </div>
          </div>
          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            placeholder="+1 555 0100"
            {...register("phone")}
          />

          {user.authProvider === "google" && (
            <p className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3 text-xs text-blue-600 dark:text-blue-300">
              This account uses Google Sign-In. Password changes must be made
              through Google.
            </p>
          )}

          <Button type="submit" loading={isSubmitting} size="lg">
            Save Changes
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
