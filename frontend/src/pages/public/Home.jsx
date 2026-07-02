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
    <div className="space-y-20 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-luxury-charcoal min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        {/* Soft Indigo Glow */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-luxury-gold/5 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-b from-luxury-charcoal/40 via-luxury-charcoal/60 to-luxury-charcoal" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-6"
          >
            <p className="inline-block rounded-full bg-primary-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary-400 border border-primary-500/20">
              Premium Car Rental Marketplace
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-luxury-ivory sm:text-6xl lg:text-7xl">
              Drive the car you <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-luxury-gold">actually want</span>
            </h1>
            <p className="text-base sm:text-xl text-luxury-ivory/70 leading-relaxed max-w-xl">
              Rent from local owners or list your own car. Book premium vehicles
              near you — in minutes.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex max-w-2xl items-center gap-2 rounded-2xl bg-white/5 p-2 backdrop-blur-md border border-white/10 shadow-premium focus-within:border-primary-500/50 transition-all duration-300"
            >
              <Search className="ml-4 h-5.5 w-5.5 text-luxury-ivory/60 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand, city or model…"
                className="flex-1 bg-transparent px-2 py-3 text-luxury-ivory placeholder:text-luxury-ivory/40 focus:outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-premium hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Search
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-luxury-ivory/60">
              {[
                "No hidden fees",
                "Flexible cancellation",
                "Verified owners",
              ].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-luxury-gold" />{" "}
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-luxury-ivory">
              How Rentify Works
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
              Three simple steps to unlock your next driving experience.
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white/40 dark:bg-luxury-deep/40 backdrop-blur-sm p-8 text-center hover:scale-[1.03] transition-transform duration-300 shadow-sm hover:shadow-premium"
              >
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100/50 dark:bg-primary-900/20 shadow-inner">
                  <Icon className="h-6.5 w-6.5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-gray-900 dark:text-luxury-ivory">
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
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-luxury-ivory">
                Recently Listed
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Fresh arrivals from our trusted community
              </p>
            </div>
            <Link
              to={ROUTES.CARS}
              className="rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-luxury-deep px-5 py-2.5 text-sm font-semibold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all shadow-sm"
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
      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-luxury-ivory">
              What Our Community Says
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
              Feedback from verified renters and car owners.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-xl2 border border-gray-100 dark:border-gray-800 bg-white dark:bg-luxury-deep p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4.5 w-4.5 fill-luxury-gold text-luxury-gold"
                      />
                    ))}
                  </div>
                  <p className="text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed">
                    "{text}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-luxury-ivory text-sm">
                      {name}
                    </p>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-luxury-ivory">
            Frequently Asked Questions
          </h2>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/60 dark:bg-luxury-deep/60 backdrop-blur-sm p-6 sm:p-8 space-y-2 shadow-sm">
            {FAQS.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      {(!isAuthenticated || role !== "customer") && (
        <section className="mx-6 sm:mx-12 lg:mx-20 rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-6 py-16 text-center shadow-premium relative overflow-hidden">
          {/* Glowing background highlights */}
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-luxury-gold/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Ready to list your car?
            </h2>
            <p className="text-base sm:text-lg text-primary-100 max-w-md mx-auto leading-relaxed">
              Turn your asset into income. List your car on Rentify and start earning when it's idle.
            </p>
            <Link
              to={ROUTES.REGISTER}
              className="inline-block rounded-full bg-white hover:bg-luxury-gold px-8 py-3.5 font-bold text-primary-900 hover:text-luxury-charcoal hover:scale-105 active:scale-95 shadow-md hover:shadow-lg transition-all"
            >
              Get Started as an Owner
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
