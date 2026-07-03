import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Car, IndianRupee, ShieldCheck, Clock, CheckCircle, Phone, MapPin, ExternalLink, Navigation } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth.js";
import bookingService from "../../services/bookingService.js";
import { formatCurrency } from "../../utils/formatters.js";
import { ROUTES } from "../../constants/routes.js";

const ActiveRental = () => {
  const { user } = useAuth();
  const [activeTrip, setActiveTrip] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(true);

  // Map route coordinate path simulations based on selected brand/model
  const [mapRouteCoords, setMapRouteCoords] = useState({
    path: "M 50,220 C 120,200 120,80 220,100 C 300,120 300,50 350,40",
    xArray: [50, 100, 150, 200, 250, 300, 350],
    yArray: [220, 180, 100, 100, 110, 60, 40],
    rotArray: [-30, -50, 10, 5, -45, -30, 0]
  });

  // Alter coordinates slightly based on car brand to personalize the route map
  const updateMapRoute = (brand) => {
    const seed = brand?.charCodeAt(0) || 0;
    if (seed % 3 === 0) {
      setMapRouteCoords({
        path: "M 50,200 C 100,100 200,200 250,80 C 300,40 320,80 350,50",
        xArray: [50, 100, 175, 250, 290, 320, 350],
        yArray: [200, 100, 150, 80, 50, 80, 50],
        rotArray: [-45, 10, -30, -45, -20, 30, 0]
      });
    } else if (seed % 3 === 1) {
      setMapRouteCoords({
        path: "M 50,220 L 150,150 L 250,120 L 350,40",
        xArray: [50, 100, 150, 200, 250, 300, 350],
        yArray: [220, 185, 150, 135, 120, 80, 40],
        rotArray: [-35, -35, -35, -15, -15, -40, -40]
      });
    } else {
      setMapRouteCoords({
        path: "M 50,220 C 120,200 120,80 220,100 C 300,120 300,50 350,40",
        xArray: [50, 100, 150, 200, 250, 300, 350],
        yArray: [220, 180, 100, 100, 110, 60, 40],
        rotArray: [-30, -50, 10, 5, -45, -30, 0]
      });
    }
  };

  useEffect(() => {
    const fetchActiveTrip = async () => {
      try {
        const bookings = await bookingService.getMyBookings();
        const list = bookings || [];

        // Locate active trip: approved booking where current time is between start and end
        const now = new Date();
        const trip = list.find((b) => {
          const start = new Date(b.pickupDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(b.returnDate);
          end.setHours(23, 59, 59, 999);
          return b.bookingStatus === "confirmed" && now >= start && now <= end;
        });

        if (trip) {
          setActiveTrip(trip);
          updateMapRoute(trip.car?.brand);
        } else {
          setActiveTrip(null);
        }
      } catch (error) {
        console.error("Failed to load active trip:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTrip();
  }, []);

  // Live countdown timer logic
  useEffect(() => {
    if (!activeTrip) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const targetDate = new Date(activeTrip.returnDate);
      targetDate.setHours(23, 59, 59, 999);
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Trip completed");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s remaining`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [activeTrip]);

  const handleCallOwner = (ownerName, phone) => {
    if (!phone) {
      toast.error("Contact phone number is not available.");
      return;
    }
    toast.success(`Calling ${ownerName}: ${phone}`);
    window.location.href = `tel:${phone}`;
  };

  const handleGetDirections = (location) => {
    if (!location) return;
    toast.success("Opening Google Maps directions...");
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, "_blank");
  };

  const handleCancelTrip = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this active rental trip? This action cannot be undone.")) return;
    try {
      await bookingService.cancelBooking(id);
      toast.success("Active rental trip successfully cancelled.");
      setActiveTrip(null);
    } catch (err) {
      toast.error(err?.message || "Failed to cancel rental.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  // If no active trip is found in the database, display a beautiful empty state
  if (!activeTrip) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center max-w-lg space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-2xl h-24 w-24 animate-pulse mx-auto" />
          <div className="relative p-5 bg-gray-50 dark:bg-luxury-deep border border-gray-150 dark:border-gray-800 text-gray-400 dark:text-gray-500 rounded-3xl w-fit mx-auto">
            <Car className="h-12 w-12" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-black text-gray-900 dark:text-luxury-ivory leading-tight">
            No Active Trip Found
          </h2>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
            You don't have any active rental bookings in progress today. Once you book a car and the pickup time starts, you'll be able to track your trip live here!
          </p>
        </div>

        <Link to={ROUTES.CARS} className="w-full sm:w-auto pt-2">
          <button
            type="button"
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-3.5 text-sm font-bold text-white shadow-premium hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
          >
            Browse Available Cars
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-luxury-ivory">
            Active Rental Tracker 🚗
          </h1>
          <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
            Monitor your ongoing trip schedule, host information, and navigation directions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider animate-pulse">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Live Trip Active
          </span>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Timer HUD (Col span 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main HUD Panel */}
          <div className="rounded-2xl border border-gray-150 dark:border-gray-800/80 bg-white dark:bg-luxury-deep p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Currently Driving</p>
                <h2 className="font-display text-2.5xl sm:text-3.5xl font-black text-gray-900 dark:text-luxury-ivory tracking-tight leading-none">
                  {activeTrip.car?.brand} {activeTrip.car?.model}
                </h2>
              </div>
              <div className="p-3.5 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-2xl">
                <Car className="h-8 w-8" />
              </div>
            </div>

            <hr className="border-gray-100 dark:border-gray-800/80" />

            {/* Live Timer Section */}
            <div className="rounded-2xl bg-gray-50/50 dark:bg-luxury-charcoal/40 border border-gray-150 dark:border-gray-800/60 p-5 space-y-2">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Time Left Until Return</p>
              <h3 className="font-mono text-3xl sm:text-4.5xl font-black text-primary-600 dark:text-emerald-400 tracking-wider leading-none select-none">
                {timeLeft || "Calculating time…"}
              </h3>
            </div>

            {/* Trip Specs details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-250 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary-500 shrink-0" /> {activeTrip.car?.location || "Delhi-NCR"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Booking Cost</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-250 mt-0.5 flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4 text-primary-500 shrink-0" /> {formatCurrency(activeTrip.totalPrice)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pickup Plate Status</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 shrink-0" /> Verified MH-12
                </p>
              </div>
            </div>

          </div>

          {/* Host Card Panel */}
          <div className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-luxury-deep p-6 shadow-sm space-y-5">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory leading-none">
              Your Booking Host
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center font-bold text-2xl text-white shadow-premium">
                  {activeTrip.owner?.name?.charAt(0) || "O"}
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base text-gray-900 dark:text-luxury-ivory leading-snug">
                    {activeTrip.owner?.name || "Verified Host"}
                  </h4>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                    Premium Rentify Partner
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleGetDirections(activeTrip.car?.location)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white hover:bg-gray-50 dark:bg-luxury-deep dark:hover:bg-luxury-deep/60 px-5 py-3 text-xs font-bold text-gray-700 dark:text-gray-250 shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" /> Get Directions
                </button>
                <button
                  type="button"
                  onClick={() => handleCallOwner(activeTrip.owner?.name, activeTrip.owner?.phone)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 px-5 py-3 text-xs font-bold text-white shadow-premium transition-all active:scale-95 cursor-pointer"
                >
                  <Phone className="h-4 w-4" /> Call Host
                </button>
              </div>
            </div>
          </div>

          {/* Renter compliance checklist */}
          <div className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-luxury-deep p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory leading-none">
              Safety & Return Guidelines 🛡️
            </h3>
            <ul className="space-y-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Physical DL check is mandatory at pickup. Keep it accessible.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Review pre-existing scratches and upload checklist photos on your phone.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Return vehicle with original fuel levels to avoid surcharges.</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={() => handleCancelTrip(activeTrip._id)}
              className="w-full mt-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 hover:bg-red-100/55 py-3 text-xs font-bold text-red-600 dark:text-red-400 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Cancel Active Rental
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Animated Map (Col span 5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Simulated Animated Tracking Map */}
          <div className="rounded-2xl border border-gray-150 dark:border-gray-800/80 bg-white dark:bg-luxury-deep p-6 shadow-sm space-y-4 overflow-hidden relative">
            <div>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-luxury-ivory">
                Live Route Simulator
              </h3>
              <p className="text-xs font-semibold text-gray-400 mt-0.5">
                Simulating vehicle position updates on path.
              </p>
            </div>

            {/* Interactive SVG route canvas with moving car pin! */}
            <div className="relative h-72 rounded-xl bg-gray-100 dark:bg-luxury-charcoal/80 border border-gray-150 dark:border-gray-800/50 overflow-hidden">
              
              {/* Map background grids and shapes */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              {/* Mock roads */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Route Path line */}
                <path
                  id="route-path"
                  d={mapRouteCoords.path}
                  fill="transparent"
                  stroke="#374151"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="stroke-gray-300 dark:stroke-gray-700"
                />
                
                {/* Active Highlight Route Line */}
                <path
                  d={mapRouteCoords.path}
                  fill="transparent"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="12 6"
                  className="animate-[dash_10s_linear_infinite]"
                />

                {/* Start Location Node */}
                <circle cx="50" cy="220" r="6" fill="#10b981" />
                
                {/* Destination Node */}
                <circle cx="350" cy="40" r="6" fill="#ef4444" />
              </svg>

              {/* Pulsing indicator at Destination */}
              <div className="absolute top-[32px] left-[342px] h-4 w-4 bg-red-500/30 rounded-full animate-ping" />

              {/* Animated vehicle overlay driving along the path! */}
              <motion.div
                key={activeTrip._id}
                animate={{
                  x: mapRouteCoords.xArray,
                  y: mapRouteCoords.yArray,
                  rotate: mapRouteCoords.rotArray
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute h-8 w-8 -translate-x-4 -translate-y-4 bg-primary-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-white"
              >
                <Navigation className="h-4 w-4 rotate-90" />
              </motion.div>

              {/* Start/End location tags */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-luxury-deep/90 border border-gray-150 dark:border-gray-800/80 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-sm flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Start: City Hub
              </div>

              <div className="absolute top-4 right-4 bg-white/90 dark:bg-luxury-deep/90 border border-gray-150 dark:border-gray-800/80 rounded-lg px-2 py-1 text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-sm flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500" /> End: {activeTrip.car?.location || "Delhi-NCR"}
              </div>

            </div>
          </div>

          {/* Clean Insurance Info */}
          <div className="rounded-2xl border border-primary-100 dark:border-primary-950/20 bg-primary-50/20 dark:bg-primary-950/5 p-5 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-primary-500 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-sm text-gray-955 dark:text-luxury-ivory leading-none">
                Insurance Protection
              </h4>
              <p className="text-xs font-semibold text-gray-500 leading-normal">
                This trip is covered by Rentify Roadside Shield protection. In case of emergency or breakdown, contact support at 1800-RENTIFY.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ActiveRental;
