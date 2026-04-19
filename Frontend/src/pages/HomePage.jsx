import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/client";
import ContentRail from "../components/ContentRail";
import HeroSlider from "../components/HeroSlider";
import { RailSkeleton } from "../components/Skeletons";
import { useAuth } from "../context/AuthContext";
import { useStorefront } from "../context/StorefrontContext";

const HomePage = () => {
  const {
    hero,
    trending,
    popularWebSeries,
    tvShows,
    serials,
    recentlyAdded,
    loading,
    error,
  } = useStorefront();
  const { isAuthenticated } = useAuth();
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    const loadContinueWatching = async () => {
      if (!isAuthenticated) {
        setContinueWatching([]);
        return;
      }

      try {
        const { data } = await api.get("/user/continue-watching");
        setContinueWatching(data.data || []);
      } catch {
        setContinueWatching([]);
      }
    };

    loadContinueWatching();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="pt-20">
        <div className="h-[620px] animate-pulse bg-white/[0.08]" />
        <div className="section-shell py-10">
          <RailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-shell py-32">
        <div className="cinema-panel rounded-lg p-8">
          <h1 className="text-3xl font-black text-white">Catalog unavailable</h1>
          <p className="muted-copy mt-3">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <HeroSlider items={hero} />

      {continueWatching.length ? (
        <section className="section-shell py-9">
          <div className="mb-5 flex items-center gap-3">
            <Clock3 className="h-6 w-6 text-red-400" />
            <h2 className="text-2xl font-black text-white sm:text-3xl">Continue Watching</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {continueWatching.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="cinema-card overflow-hidden rounded-lg"
              >
                <img
                  src={item.content.banner}
                  alt=""
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold text-white">{item.content.title}</p>
                    <p className="text-sm text-neutral-400">{Math.round(item.progress)}%</p>
                  </div>
                  <div className="h-1.5 rounded bg-white/10">
                    <div
                      className="h-full rounded bg-red-500 shadow-[0_0_18px_rgba(239,59,59,0.55)]"
                      style={{ width: `${Math.min(item.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <ContentRail
        title="Trending Movies"
        subtitle="Fresh, high-intent picks across the platform."
        items={trending}
        to="/movies"
      />
      <ContentRail
        title="Popular Web Series"
        subtitle="Seasonal originals made for long weekend viewing."
        items={popularWebSeries}
        to="/web-series"
      />
      <ContentRail
        title="TV Shows"
        subtitle="Reality, comedy, kids, and documentaries."
        items={tvShows}
        to="/tv-shows"
      />
      <ContentRail title="Serials" subtitle="Daily drama and family sagas." items={serials} to="/serials" />
      <ContentRail title="Recently Added" items={recentlyAdded} to="/search?sort=-createdAt" />
    </div>
  );
};

export default HomePage;
