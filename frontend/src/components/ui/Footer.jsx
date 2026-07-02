import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { ROUTES } from "../../constants/routes.js";

const Footer = () => (
  <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-luxury-charcoal">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 via-indigo-500 to-luxury-gold p-[2px] shadow-premium group-hover:rotate-6 group-hover:scale-105 transition-all duration-500">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-luxury-deep">
                <Car className="h-4.5 w-4.5 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <span className="font-display text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-primary-500 to-luxury-gold dark:from-white dark:via-primary-400 dark:to-luxury-gold">
              Rentify
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            A premium marketplace connecting car owners with people who need a
            ride — book in minutes, list in minutes.
          </p>
          <div className="mt-5">
            <a
              href="https://github.com/Mudit024/Rentify"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-250 dark:border-gray-800 bg-gray-50/50 dark:bg-luxury-deep/40 px-4 py-2 text-xs font-bold text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
            >
              <FaGithub className="h-4 w-4" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-luxury-ivory">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link to={ROUTES.CARS} className="hover:text-primary-600">
                Browse Cars
              </Link>
            </li>
            <li>
              <Link to={ROUTES.REGISTER} className="hover:text-primary-600">
                List Your Car
              </Link>
            </li>
            <li>
              <Link to={ROUTES.HOME} className="hover:text-primary-600">
                How It Works
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-100 dark:border-gray-800 pt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()}  Rentify. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
