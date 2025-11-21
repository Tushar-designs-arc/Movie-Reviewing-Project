import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Film,
  ChevronDown,
  Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { THEMES } from "../../constants/ui";
import { ROUTES } from "../../constants/routes";
import { getAvatarUrl } from "../../utils/image";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const avatarUrl = getAvatarUrl(user);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="site-header sticky top-0 z-40 w-full">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3 lg:gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="icon-action rounded-lg p-2 text-muted transition hover:text-theme lg:hidden"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2.5 transition focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1"
          >
            <div className="brand-mark flex h-9 w-9 items-center justify-center rounded-xl font-black text-white">
              <Film className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-black tracking-tight text-theme">
                MovieVerse
              </span>
              <span className="ml-1.5 rounded bg-red-600/20 px-1.5 py-0.5 text-[10px] font-black uppercase text-red-500 tracking-wider">
                Admin
              </span>
            </div>
          </Link>
        </div>

        {/* Right Side: Theme Toggle & Admin Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-action flex h-10 w-10 items-center justify-center rounded-xl text-muted transition hover:text-theme"
            aria-label={`Switch to ${theme === THEMES.DARK ? "light" : "dark"} theme`}
            title={`Switch to ${theme === THEMES.DARK ? "light" : "dark"} theme`}
          >
            {theme === THEMES.DARK ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-cyan-400" />
            )}
          </button>

          {/* User Profile Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="User account menu"
              className="flex items-center gap-2.5 rounded-xl border border-theme bg-surface-soft/60 p-1.5 pr-3 text-left transition hover:bg-surface-soft hover:border-red-500/40 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.fullName || "Admin user"}
                  className="h-7 w-7 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/20 text-red-500">
                  <UserIcon className="h-4 w-4" />
                </div>
              )}
              <span className="hidden text-xs font-bold text-theme md:block max-w-[120px] truncate">
                {user?.fullName || user?.username || "Admin Account"}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                role="menu"
                aria-orientation="vertical"
                className="cinema-panel absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl z-50 border border-theme"
              >
                <div className="border-b border-theme p-3">
                  <p className="text-xs font-black text-theme truncate">
                    {user?.fullName || "Administrator"}
                  </p>
                  <p className="muted-copy text-[11px] truncate mt-0.5">
                    {user?.email || "admin@movieverse.com"}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded bg-purple-500/15 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                    <Shield className="h-3 w-3" />
                    <span>System Administrator</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-600/10 hover:text-red-500 focus:outline-none"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
