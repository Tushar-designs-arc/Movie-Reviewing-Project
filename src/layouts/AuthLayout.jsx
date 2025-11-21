import { Navigate, Outlet } from "react-router-dom";
import { Film } from "lucide-react";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import RouteLoadingFallback from "../components/common/RouteLoadingFallback";

const AuthLayout = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <RouteLoadingFallback />;
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  return (
    <div className="app-frame flex min-h-screen flex-col">
      <header className="py-6 px-4 text-center">
        <div className="inline-flex items-center gap-3">
          <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-xl font-black text-white shadow-xl">
            <Film className="h-6 w-6" />
          </div>
          <div className="text-left">
            <span className="font-display text-xl font-black tracking-tight text-theme">
              MovieVerse
            </span>
            <span className="ml-2 rounded bg-red-600/20 px-2 py-0.5 text-xs font-black uppercase text-red-500 tracking-wider">
              Admin
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;
