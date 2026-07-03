import { Outlet } from 'react-router-dom';

import Navbar from '../components/ui/Navbar.jsx';
import Footer from '../components/ui/Footer.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-slate-50 via-luxury-ivory to-primary-50/20 text-gray-900 dark:bg-gradient-to-tr dark:from-luxury-charcoal dark:via-luxury-deep dark:to-luxury-charcoal dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;