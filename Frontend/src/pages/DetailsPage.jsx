import { BookmarkPlus, Heart, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import ContentRail from "../components/ContentRail";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { contentId, typeLabels } from "../utils/content";

const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [content, setContent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/content/${id}`);
        setContent(data.content);
        setRecommendations(data.recommendations || []);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  const addToLibrary = async (collection) => {
    if (!isAuthenticated) {
      showToast("Please log in to personalize your OTT library.", "info");
      navigate("/login");
      return;
    }

    try {
      await api.post(`/user/${collection}`, { contentId: contentId(content) });
      showToast(collection === "favorites" ? "Added to favorites." : "Added to watchlist.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Could not update your library.", "error");
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <div className="h-[560px] animate-pulse bg-white/[0.08]" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="section-shell py-32">
        <div className="cinema-panel rounded-lg p-10 text-center">
          <h1 className="text-3xl font-black text-white">Title not found</h1>
        </div>
      </div>
    );
  }

  const key = contentId(content);
  const detailStats = [
    ["Year", content.releaseYear],
    ["Runtime", content.duration],
    ["Language", content.language],
    ["Episodes", content.episodes],
  ].filter(([, value]) => value);

  return (
    <div className="pb-12 pt-20">
      <section className="relative overflow-hidden bg-[#050609]">
        <img src={content.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.58]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050609] via-[#050609]/82 to-[#050609]/16" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[#050609]/18 to-[#050609]/72" />
        <div className="section-shell relative z-10 flex min-h-[590px] flex-col justify-end pb-12 pt-20">
          <div className="max-w-4xl">
            <p className="eyebrow mb-4">Now streaming</p>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-md bg-red-600 px-3 py-1 text-xs font-black uppercase text-white shadow-[0_10px_26px_rgba(229,9,20,0.24)]">
                {typeLabels[content.type] || content.type}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.12] px-3 py-1 text-xs font-bold text-white ring-1 ring-white/10">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {content.rating}
              </span>
              <span className="rounded-md bg-white/[0.12] px-3 py-1 text-xs font-bold text-white ring-1 ring-white/10">
                {content.maturity}
              </span>
            </div>
            <h1 className="text-5xl font-black leading-none text-white sm:text-6xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-200">
              {content.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {content.genre?.map((genre) => (
                <span key={genre} className="rounded-md bg-white/[0.09] px-3 py-1 text-sm text-neutral-200 ring-1 ring-white/5">
                  {genre}
                </span>
              ))}
            </div>
            <div className="mt-6 grid max-w-3xl grid-cols-2 gap-2 text-sm text-neutral-300 sm:grid-cols-4">
              {detailStats.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-black/[0.32] px-3 py-2">
                  <p className="text-[11px] font-bold uppercase text-neutral-500">{label}</p>
                  <p className="mt-1 font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-neutral-300">
              <span className="text-neutral-500">Cast:</span> {content.cast?.join(", ")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={`/watch/${key}`}
                className="primary-action inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-black transition"
              >
                <Play className="h-5 w-5 fill-white" />
                Watch Now
              </Link>
              <button
                type="button"
                onClick={() => addToLibrary("watchlist")}
                className="secondary-action inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-bold transition"
              >
                <BookmarkPlus className="h-5 w-5" />
                Watchlist
              </button>
              <button
                type="button"
                onClick={() => addToLibrary("favorites")}
                className="secondary-action inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-bold transition"
              >
                <Heart className="h-5 w-5" />
                Favorite
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="cinema-panel rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Preview</p>
                <h2 className="mt-1 text-2xl font-black text-white">Trailer</h2>
              </div>
              <span className="hidden rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs font-bold uppercase text-neutral-300 sm:inline-flex">
                HD
              </span>
            </div>
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                src={content.trailerUrl}
                title={`${content.title} trailer`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {recommendations.length ? (
              <div className="poster-strip mt-5">
                {[content, ...recommendations].slice(0, 8).map((item) => (
                  <Link
                    key={contentId(item)}
                    to={`/details/${contentId(item)}`}
                    className="group"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-black">
                      <img
                        src={item.poster}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      <p className="absolute bottom-2 left-2 right-2 line-clamp-1 text-xs font-black text-white">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <div className="cinema-panel rounded-lg p-5">
            <p className="eyebrow">Overview</p>
            <h2 className="mt-1 text-2xl font-black text-white">Details</h2>
            <div className="mt-5 space-y-4 text-sm text-neutral-300">
              <p>
                <span className="text-neutral-500">Director:</span> {content.director}
              </p>
              <p>
                <span className="text-neutral-500">Seasons:</span> {content.seasons || "N/A"}
              </p>
              <p>
                <span className="text-neutral-500">Tags:</span> {content.tags?.join(", ")}
              </p>
            </div>
            <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
              <img
                src={content.poster}
                alt={`${content.title} poster`}
                className="aspect-[2/3] w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <ContentRail title="Recommended For You" items={recommendations} />
    </div>
  );
};

export default DetailsPage;
