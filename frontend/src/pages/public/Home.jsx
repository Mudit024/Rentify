import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../redux/slices/carSlice.js";
import CarCard from "../../components/cars/CarCard.jsx";
import { CarGridSkeleton } from "../../components/common/Skeleton.jsx";
import { ROUTES } from "../../constants/routes.js";
import { useAuth } from "../../hooks/useAuth.js";

const FAQS = [
  {
    q: "How do I book a car?",
    a: "Browse available cars, choose your pickup and return dates, and confirm the booking. The owner approves within 24 hours.",
  },
  {
    q: "Can I list my own car?",
    a: "Yes — register as a Car Owner, list your car with photos and pricing, and our team approves the listing within one business day.",
  },
  {
    q: "What if I need to cancel?",
    a: "Customers can cancel any pending or approved booking from their dashboard before the pickup date.",
  },
  {
    q: "Is payment handled in the app?",
    a: "Payment is currently arranged directly between customers and owners after booking approval.",
  },
];

const TESTIMONIALS = [
  {
    name: "Aisha Rahman",
    role: "Frequent Renter",
    text: "Booked a premium SUV for a weekend road trip in minutes. Seamless experience from start to finish.",
    rating: 5,
  },
  {
    name: "Carlos Mendez",
    role: "Car Owner",
    text: "Listed my car and got my first booking within 48 hours. Rentify handles everything — love it.",
    rating: 5,
  },
  {
    name: "Priya Singh",
    role: "Business Traveler",
    text: "Needed a clean sedan for client meetings. Picked up the keys from a nearby owner — total game changer.",
    rating: 5,
  },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900 dark:text-luxury-ivory">
          {q}
        </span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: cars, status } = useSelector((state) => state.cars);
  const { isAuthenticated, role } = useAuth();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "owner") {
        navigate(ROUTES.OWNER_DASHBOARD, { replace: true });
        return;
      }
      if (role === "admin") {
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
        return;
      }
    }
    dispatch(fetchCars({ limit: 6, sort: "-createdAt" }));
  }, [dispatch, isAuthenticated, role, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate(ROUTES.CARS);
      return;
    }

    navigate(`${ROUTES.CARS}?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-luxury-charcoal">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal/60 via-luxury-charcoal/40 to-luxury-charcoal" />
        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-40 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-luxury-gold">
              Premium Car Rental Marketplace
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-luxury-ivory sm:text-5xl lg:text-6xl">
              Drive the car you actually want
            </h1>
            <p className="mt-5 text-lg text-luxury-ivory/70 leading-relaxed">
              Rent from local owners or list your own car. Book premium vehicles
              near you — in minutes.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-10 flex max-w-xl items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur-sm border border-white/20"
            >
              <Search className="ml-4 h-5 w-5 text-luxury-ivory/60 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand, city or model…"
                className="flex-1 bg-transparent px-2 py-2 text-luxury-ivory placeholder:text-luxury-ivory/50 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-luxury-ivory/60">
              {[
                "No hidden fees",
                "Flexible cancellation",
                "Verified owners",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-luxury-gold" />{" "}
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-luxury-charcoal py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
              How Rentify works
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Three steps to your next drive
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Browse & Search",
                desc: "Filter by location, date, transmission, fuel type and price to find the right car.",
              },
              {
                icon: Shield,
                title: "Book Securely",
                desc: "Select your dates, confirm the pickup location, and send the booking request.",
              },
              {
                icon: Clock,
                title: "Drive Same Day",
                desc: "Owner approves the booking and you pick up the keys. That simple.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl2 border border-gray-100 dark:border-gray-800 p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/30">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-gray-900 dark:text-luxury-ivory">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured cars */}
      <section className="bg-luxury-ivory dark:bg-gray-950 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
                Recently listed
              </h2>
              <p className="mt-1 text-gray-500">
                Fresh cars from our growing community
              </p>
            </div>
            <Link
              to={ROUTES.CARS}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              Browse all →
            </Link>
          </div>
          {status === "loading" ? (
            <CarGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cars.slice(0, 6).map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-luxury-charcoal py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
              What our community says
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-xl2 border border-gray-100 dark:border-gray-800 p-6"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-luxury-gold text-luxury-gold"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  "{text}"
                </p>
                <div className="mt-4">
                  <p className="font-semibold text-gray-900 dark:text-luxury-ivory">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-luxury-ivory dark:bg-gray-950 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-gray-900 dark:text-luxury-ivory">
            Frequently asked questions
          </h2>
          {FAQS.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary-700 px-6 py-16 text-center">
        <h2 className="font-display text-3xl font-bold text-white">
          Ready to list your car?
        </h2>
        <p className="mt-3 text-primary-200">
          Earn money from your car when you're not using it.
        </p>
        <Link
          to={ROUTES.REGISTER}
          className="mt-8 inline-block rounded-full bg-luxury-gold px-8 py-3 font-semibold text-luxury-charcoal hover:bg-luxury-gold/90 transition-colors"
        >
          Get Started as an Owner
        </Link>
      </section>
    </div>
  );
};

export default Home;
