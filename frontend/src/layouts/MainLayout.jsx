import { Outlet } from 'react-router-dom';

import Navbar from '../components/ui/Navbar.jsx';
import Footer from '../components/ui/Footer.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-ivory text-gray-900 dark:bg-luxury-charcoal dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;