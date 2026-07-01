import { Link, Outlet } from 'react-router-dom';
import { Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '../constants/routes.js';

const AuthLayout = () => (
  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
    <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 bg-white dark:bg-luxury-charcoal">
      <Link to={ROUTES.HOME} className="mb-10 flex items-center gap-2">
        <div className="rounded-lg bg-primary-600 p-1.5">
          <Car className="h-5 w-5 text-white" />
        </div>
        <span className="font-display text-xl font-bold text-gray-900 dark:text-luxury-ivory">DriveEase</span>
      </Link>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Outlet />
      </motion.div>
    </div>

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
        <h2 className="font-display text-3xl font-semibold leading-tight">
          Drive what you want, when you want it.
        </h2>
        <p className="mt-4 text-sm text-luxury-ivory/70">
          Join a community of car owners and renters built on trust, premium experiences, and effortless booking.
        </p>
      </div>
    </div>
  </div>
);

export default AuthLayout;
