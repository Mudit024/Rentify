import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar.jsx';
import OwnerSidebar from '../components/owner/OwnerSidebar.jsx';

const OwnerLayout = () => (
  <div className="flex min-h-screen flex-col bg-luxury-ivory dark:bg-luxury-charcoal">
    <Navbar />
    <div className="flex flex-1">
      <OwnerSidebar />
      <main className="flex-1 px-6 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default OwnerLayout;
