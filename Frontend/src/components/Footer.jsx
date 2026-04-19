import { Instagram, PlayCircle, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative z-10 border-t border-white/10 bg-[#05070c]/85">
    <div className="section-shell py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="brand-mark flex h-11 w-11 items-center justify-center rounded-lg text-lg font-black text-white">
              O
            </div>
            <div>
              <p className="text-xl font-black text-white">OTTVerse</p>
              <p className="text-xs uppercase text-neutral-400">Stream Hub</p>
            </div>
          </div>

          <p className="max-w-md text-sm leading-7 text-neutral-400">
            Movies, web series, TV shows, serials, favorites, watchlists, and resume playback in
            one full-stack streaming project.
          </p>

          <div className="flex items-center gap-3">
            {[Twitter, Instagram, Youtube, PlayCircle].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="icon-action inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-300 transition hover:text-white"
                aria-label="Social placeholder"
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-lg font-black text-white">Browse</p>
          <div className="flex flex-col gap-3 text-sm text-neutral-400">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <Link to="/movies" className="transition hover:text-white">
              Movies
            </Link>
            <Link to="/web-series" className="transition hover:text-white">
              Web Series
            </Link>
            <Link to="/tv-shows" className="transition hover:text-white">
              TV Shows
            </Link>
            <Link to="/serials" className="transition hover:text-white">
              Serials
            </Link>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-lg font-black text-white">Library</p>
          <div className="flex flex-col gap-3 text-sm text-neutral-400">
            <Link to="/search" className="transition hover:text-white">
              Search
            </Link>
            <Link to="/watchlist" className="transition hover:text-white">
              Watchlist
            </Link>
            <Link to="/favorites" className="transition hover:text-white">
              Favorites
            </Link>
            <Link to="/profile" className="transition hover:text-white">
              Profile
            </Link>
          </div>
        </div>

        <div className="cinema-panel space-y-5 rounded-lg p-6">
          <p className="text-lg font-black text-white">Admin Demo</p>
          <p className="text-sm leading-7 text-neutral-400">
            Seeded admin credentials: admin@ott.local / admin123.
          </p>
          <Link
            to="/admin"
            className="primary-action inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-black transition"
          >
            Open Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
        <p>(c) 2026 OTTVerse.</p>
        <p>Demo content and sample video are included for development.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
