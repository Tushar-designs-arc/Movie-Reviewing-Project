import { Bookmark, Heart, LogOut, Menu, Moon, Search, Sun, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Web Series", to: "/web-series" },
  { label: "TV Shows", to: "/tv-shows" },
  { label: "Serials", to: "/serials" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
    setIsMenuOpen(false);
  };

  const navLinkClassName = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-bold transition ${isActive ? "nav-pill-active" : "nav-pill"}`;

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-lg text-lg font-black text-white">
            O
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black leading-none text-white">OTTVerse</p>
            <p className="text-[11px] uppercase text-[var(--muted)]">Stream Hub</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <form onSubmit={handleSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search movies, shows, series"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="cinema-input w-64 py-2.5 pl-10 pr-4 text-sm xl:w-80"
            />
          </form>

          <button
            type="button"
            onClick={toggleTheme}
            className="icon-action inline-flex h-10 w-10 items-center justify-center rounded-md transition"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/watchlist"
                className="icon-action inline-flex h-10 w-10 items-center justify-center rounded-md transition"
                aria-label="Open watchlist"
                title="Watchlist"
              >
                <Bookmark className="h-4 w-4" />
              </Link>
              <Link
                to="/favorites"
                className="icon-action inline-flex h-10 w-10 items-center justify-center rounded-md transition"
                aria-label="Open favorites"
                title="Favorites"
              >
                <Heart className="h-4 w-4" />
              </Link>
              <Link
                to="/profile"
                className="bright-action inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition"
              >
                <User className="h-4 w-4" />
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="icon-action inline-flex h-10 w-10 items-center justify-center rounded-md transition"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="primary-action rounded-md px-4 py-2.5 text-sm font-black transition"
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="icon-action inline-flex h-10 w-10 items-center justify-center rounded-md transition md:hidden"
          aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-white/10 bg-[var(--panel-strong)] p-4 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search titles"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="cinema-input w-full py-3 pl-10 pr-4 text-sm"
            />
          </form>

          <div className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={navLinkClassName}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/watchlist"
                  className={navLinkClassName}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Watchlist
                </NavLink>
                <NavLink
                  to="/favorites"
                  className={navLinkClassName}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Favorites
                </NavLink>
                <NavLink
                  to="/profile"
                  className={navLinkClassName}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
              </>
            ) : (
              <NavLink to="/login" className={navLinkClassName} onClick={() => setIsMenuOpen(false)}>
                Login
              </NavLink>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
