import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Users, CalendarCheck } from 'lucide-react';
import { ROUTES } from '../../constants/routes.js';

const links = [
  { to: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.ADMIN_LISTINGS, label: 'Listing Approvals', icon: ShieldCheck, end: true },
  { to: ROUTES.ADMIN_USERS, label: 'Users', icon: Users, end: true },
  { to: ROUTES.ADMIN_BOOKINGS, label: 'All Bookings', icon: CalendarCheck, end: true },
];

const AdminSidebar = () => (
 <aside className="hidden w-64 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-luxury-charcoal px-4 py-8 lg:block">
    <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Admin Panel</p>
    <nav className="space-y-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-luxury-gold/10 text-luxury-gold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
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

export default AdminSidebar;
