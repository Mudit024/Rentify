import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";
import { authService } from "../../services/authService.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { ROUTES } from "../../constants/routes.js";
import { ROLES } from "../../constants/index.js";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [role, setRole] = useState(ROLES.CUSTOMER);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser({ ...data, role });
      toast.success("Welcome to Rentify!");
      navigate(role === ROLES.OWNER ? ROUTES.OWNER_DASHBOARD : ROUTES.HOME);
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : err?.message || "Registration failed.",
      );
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = authService.googleAuthUrl(role);
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="font-display text-3xl font-semibold text-gray-900 dark:text-luxury-ivory">
       Create Your Account
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Join Rentify and start renting or listing cars today..
      </p>

      {/* Role Toggle */}
      <div className="mt-6 flex rounded-xl border border-gray-200 dark:border-gray-700 p-1">
        {[
          { value: ROLES.CUSTOMER, label: "🚗 I want to rent a car" },
          { value: ROLES.OWNER, label: "🔑 I want to list my car" },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              role === value
                ? "bg-primary-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Full Name"
          placeholder="Jane Smith"
          icon={User}
          error={errors.name?.message}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Too short" },
          })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
          })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          icon={Lock}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Min 6 chars" },
          })}
        />

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <hr className="flex-1 border-gray-200 dark:border-gray-700" />
        <span className="text-xs text-gray-400">or</span>
        <hr className="flex-1 border-gray-200 dark:border-gray-700" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-primary-600 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
