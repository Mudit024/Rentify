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
  <aside className="hidden w-64 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-luxury-charcoal px-4 py-8 lg:block">
    <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
      Owner Panel
    </p>
    <nav className="space-y-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default OwnerSidebar;
