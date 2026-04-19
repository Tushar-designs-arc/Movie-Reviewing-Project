import { Bookmark, Clock3, Heart, LogOut, Shield, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, logout, isAdmin } = useAuth();
  const [stats, setStats] = useState({ watchlist: 0, favorites: 0, continueWatching: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const [watchlist, favorites, continueWatching] = await Promise.all([
        api.get("/user/watchlist"),
        api.get("/user/favorites"),
        api.get("/user/continue-watching"),
      ]);

      setStats({
        watchlist: watchlist.data.data?.length || 0,
        favorites: favorites.data.data?.length || 0,
        continueWatching: continueWatching.data.data?.length || 0,
      });
    };

    loadStats();
  }, []);

  const statCards = [
    { label: "Watchlist", value: stats.watchlist, icon: Bookmark, to: "/watchlist" },
    { label: "Favorites", value: stats.favorites, icon: Heart, to: "/favorites" },
    { label: "Continue", value: stats.continueWatching, icon: Clock3, to: "/" },
  ];

  return (
    <div className="section-shell min-h-screen py-28">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#050609] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:p-8">
        <div
          className="absolute inset-0 opacity-[0.42]"
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(5,6,9,0.96), rgba(5,6,9,0.76), rgba(5,6,9,0.28)), url(https://images.unsplash.com/photo-1512070679279-8988d32161be?auto=format&fit=crop&w=1600&q=80)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
              }
              alt=""
              className="h-20 w-20 rounded-lg object-cover ring-1 ring-white/15"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="eyebrow">Profile</p>
                <span className="rounded-md border border-white/10 bg-black/[0.32] px-2 py-1 text-xs font-black uppercase text-neutral-300">
                  {isAdmin ? "Admin" : "Viewer"}
                </span>
              </div>
              <h1 className="mt-1 text-4xl font-black text-white">{user?.name}</h1>
              <p className="muted-copy mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {isAdmin ? (
              <Link
                to="/admin"
                className="primary-action inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-black transition"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
              </Link>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className="secondary-action inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              to={card.to}
              className="cinema-card rounded-lg p-6 transition hover:-translate-y-1"
            >
              <Icon className="h-6 w-6 text-red-400" />
              <p className="mt-5 text-sm uppercase text-neutral-500">{card.label}</p>
              <p className="mt-1 text-4xl font-black text-white">{card.value}</p>
            </Link>
          );
        })}
      </section>

      {isAdmin ? (
        <section className="cinema-panel mt-8 rounded-lg p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red-600/15 text-red-400">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-black text-white">Admin tools enabled</h2>
                <p className="muted-copy mt-1 text-sm">Content creation and dashboard stats are available.</p>
              </div>
            </div>
            <Link
              to="/admin"
              className="secondary-action inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black transition"
            >
              <Shield className="h-4 w-4" />
              Open Panel
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ProfilePage;
