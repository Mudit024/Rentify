import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar.jsx';
import Footer from '../components/ui/Footer.jsx';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col bg-luxury-ivory dark:bg-luxury-charcoal">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
