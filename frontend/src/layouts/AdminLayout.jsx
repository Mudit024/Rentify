import { Outlet } from 'react-router-dom';

import Navbar from '../components/ui/Navbar.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-50 via-luxury-ivory to-primary-50/20 text-gray-900 transition-colors duration-300 dark:bg-gradient-to-tr dark:from-luxury-charcoal dark:via-luxury-deep dark:to-luxury-charcoal dark:text-white">

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        <AdminSidebar />

        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;