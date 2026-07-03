import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import { ROUTES } from '../../constants/routes.js';

const NotFound = () => (
  <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20">
        <Car className="h-12 w-12 text-primary-500" />
      </div>
      <h1 className="font-display text-6xl font-bold text-gray-900 dark:text-luxury-ivory">404</h1>
      <p className="mt-3 text-xl font-medium text-gray-700 dark:text-gray-300">Page not found</p>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-8 inline-block rounded-full bg-primary-600 px-8 py-3 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Back to Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
