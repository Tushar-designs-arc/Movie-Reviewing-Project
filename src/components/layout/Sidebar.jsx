import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Users,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  Settings,
  X,
  ChevronRight,
} from "lucide-react";
import { SIDEBAR_NAV_ITEMS } from "../../constants/ui";

const ICON_MAP = {
  LayoutDashboard,
  Film,
  Users,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  Settings,
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-theme bg-surface-soft/90 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header inside drawer (Mobile only) */}
        <div className="flex h-16 items-center justify-between px-6 lg:hidden border-b border-theme">
          <div className="flex items-center gap-2">
            <div className="brand-mark flex h-8 w-8 items-center justify-center rounded-lg font-black text-white">
              <Film className="h-4 w-4" />
            </div>
            <span className="font-display font-black text-theme text-base">
              Navigation
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sidebar"
            className="icon-action rounded-lg p-2 text-muted hover:text-theme"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="eyebrow px-3 mb-3 text-[10px] tracking-wider text-muted">
            Admin System Features
          </p>
          <nav
            className="space-y-1.5"
            aria-label="Main Administrative Navigation"
          >
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.iconName] || LayoutDashboard;
              const isDisabled = item.disabled;

              if (isDisabled) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold text-muted/50 opacity-75 cursor-not-allowed border border-transparent"
                    title={`${item.label} (Coming in Phase 2)`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-muted/40" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded bg-surface-soft border border-theme px-1.5 py-0.5 text-[9px] font-bold text-muted">
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? "nav-pill-active"
                        : "nav-pill hover:bg-surface-soft hover:text-theme"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-muted"}`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`h-3.5 w-3.5 opacity-60 ${isActive ? "text-white opacity-100" : ""}`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="border-t border-theme p-4 text-center">
          <p className="text-[11px] font-bold text-theme">
            MovieVerse Admin v1.0
          </p>
          <p className="muted-copy text-[10px] mt-0.5">
            Phase 1 Production Architecture
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
