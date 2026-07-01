import { Link } from "react-router-dom";
import { Car } from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { ROUTES } from "../../constants/routes.js";

const Footer = () => (
  <footer className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-luxury-charcoal">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary-600 p-1.5">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-gray-900 dark:text-luxury-ivory">
              DriveEase
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-gray-500 dark:text-gray-400">
            A premium marketplace connecting car owners with people who need a
            ride — book in minutes, list in minutes.
          </p>
          <div className="mt-5 flex gap-3">
            {[FaInstagram, FaTwitter, FaFacebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-500 hover:text-primary-600 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
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

        <div>
          <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-luxury-ivory">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <a href="#" className="hover:text-primary-600">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-600">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary-600">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-100 dark:border-gray-800 pt-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} DriveEase. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
