import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Car, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { ROUTES } from '../constants/routes.js';

const AuthLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

      {/* Left */}

      <div className="flex flex-col justify-center bg-white px-6 py-6 sm:py-8 transition-colors duration-300 dark:bg-luxury-charcoal sm:px-12 lg:px-20">

        <div className="mb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-250 dark:border-gray-800 bg-white/50 dark:bg-luxury-deep/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary-500 text-gray-500 dark:text-gray-400 transition-all shadow-sm cursor-pointer active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
        </div>

        <Link
          to={ROUTES.HOME}
          className="mb-5 flex items-center gap-2.5 group"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-indigo-500 to-luxury-gold p-[2px] shadow-premium group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-luxury-deep">
              <Car className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>

          <span className="font-display text-2.5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary-500 to-luxury-gold dark:from-white dark:via-primary-400 dark:to-luxury-gold">
            Rentify
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        >
          <Outlet />
        </motion.div>

      </div>

      {/* Right */}

      <div className="relative hidden overflow-hidden bg-luxury-charcoal lg:flex lg:items-center lg:justify-center">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal via-luxury-charcoal/60 to-transparent" />

        <div className="relative z-10 max-w-md px-10 text-center text-luxury-ivory">

          <h2 className="font-display text-4xl font-bold leading-tight">
            Premium Cars.
            <br />
            Trusted Owners.
            <br />
            Effortless Rentals.
          </h2>

          <p className="mt-6 text-base text-luxury-ivory/75">
            Rent luxury and everyday cars with a secure,
            fast and seamless booking experience.
          </p>

        </div>

      </div>

    </div>
  );
};

export default AuthLayout;