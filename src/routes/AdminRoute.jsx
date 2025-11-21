import { ShieldAlert, LogOut } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";

// UI authorization prevents accidental navigation; the API independently enforces admin access.
// This improves navigation safety only; each administrative API route still verifies the role on the server.
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="section-shell grid min-h-screen place-items-center py-20">
        <div
          role="status"
          aria-live="polite"
          className="cinema-panel flex max-w-md items-center gap-4 rounded-xl p-6 shadow-2xl"
        >
          <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-600/15 text-red-500">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black text-theme">
              Checking Permissions
            </h1>
            <p className="muted-copy mt-1 text-sm">
              Verifying administrator role...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="section-shell grid min-h-screen place-items-center py-20">
        <div className="cinema-panel max-w-lg rounded-2xl p-8 text-center shadow-2xl">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/15 text-red-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <p className="eyebrow mt-6">Access Restricted</p>
          <h1 className="mt-2 text-2xl font-black text-theme sm:text-3xl">
            Administrator Required
          </h1>
          <p className="muted-copy mx-auto mt-3 max-w-md text-sm leading-relaxed">
            Your account does not possess administrator privileges. The
            MovieVerse Admin Panel is reserved exclusively for system
            administrators.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={logout}
              className="primary-action inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition focus:ring-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
            <Link
              to={ROUTES.LOGIN}
              className="secondary-action inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition focus:ring-2 focus:ring-red-500"
            >
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
