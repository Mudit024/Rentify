import { Outlet } from "react-router-dom";

import Navbar from "../components/ui/Navbar.jsx";
import OwnerSidebar from "../components/owner/OwnerSidebar.jsx";

const OwnerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-luxury-ivory text-gray-900 transition-colors duration-300 dark:bg-luxury-charcoal dark:text-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <OwnerSidebar />

        <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;
