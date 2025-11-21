import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="app-frame flex min-h-screen flex-col">
      <Navbar onToggleSidebar={handleToggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 focus:outline-none">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminLayout;
