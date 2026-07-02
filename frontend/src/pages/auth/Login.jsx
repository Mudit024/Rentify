import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth.js";
import { authService } from "../../services/authService.js";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import { ROUTES } from "../../constants/routes.js";
import { ROLES } from "../../constants/index.js";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const from = location.state?.from?.pathname || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const redirectAfterLogin = (role) => {
    if (from) return navigate(from, { replace: true });
    if (role === ROLES.ADMIN) return navigate(ROUTES.ADMIN_DASHBOARD);
    if (role === ROLES.OWNER) return navigate(ROUTES.OWNER_DASHBOARD);
    navigate(ROUTES.HOME);
  };

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      redirectAfterLogin(user.role);
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : err?.message || "Invalid email or password.",
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authService.googleAuthUrl();
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
          Welcome Back 👋
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
          Sign in to continue your Rentify journey.
        </p>
      </div>

      {location.search.includes("error=google_auth_failed") && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 p-4 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30">
          Google sign-in failed. Please try again or use email and password.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          placeholder="Your password"
          icon={Lock}
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />

        <Button
          type="submit"
          loading={isLoading}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 py-3 font-bold text-white shadow-premium hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
          size="lg"
        >
          Sign In
        </Button>
      </form>

      <div className="flex items-center gap-3 py-2">
        <hr className="flex-1 border-gray-200 dark:border-gray-800" />
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">or</span>
        <hr className="flex-1 border-gray-200 dark:border-gray-800" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white/40 dark:bg-luxury-deep/40 hover:bg-gray-50 dark:hover:bg-gray-800/60 shadow-sm transition-all duration-300"
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

      <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
        No account yet?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="font-bold text-primary-500 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
