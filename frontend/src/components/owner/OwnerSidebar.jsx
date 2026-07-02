import { NavLink } from "react-router-dom";
import { LayoutDashboard, Car, CalendarCheck, PlusCircle } from "lucide-react";
import { ROUTES } from "../../constants/routes.js";

const links = [
  {
    to: ROUTES.OWNER_DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: ROUTES.OWNER_CARS,
    label: "My Cars",
    icon: Car,
    end: true,
  },
  {
    to: ROUTES.OWNER_ADD_CAR,
    label: "List a Car",
    icon: PlusCircle,
    end: true,
  },
  { to: ROUTES.OWNER_BOOKINGS, label: "Bookings", icon: CalendarCheck },
];

const OwnerSidebar = () => (
  <aside className="hidden w-66 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-luxury-deep/50 backdrop-blur-md px-4 py-8 lg:block">
    <p className="mb-6 px-3 text-xs font-bold uppercase tracking-widest text-primary-500">
      Owner Panel
    </p>
    <nav className="space-y-2">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              isActive
                ? "bg-primary-600 text-white shadow-premium"
                : "text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-300"
            }`
          }
        >
          <Icon className="h-4.5 w-4.5" />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default OwnerSidebar;
