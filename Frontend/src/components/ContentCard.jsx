import { BookmarkPlus, Heart, Play, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const ContentCard = ({ item, compact = false, onLibraryChange }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const id = item.id || item.slug || item._id;

  const requireLogin = () => {
    showToast("Please log in to personalize your OTT library.", "info");
    navigate("/login");
  };

  const addToLibrary = async (event, collection) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    try {
      await api.post(`/user/${collection}`, { contentId: id });
      showToast(collection === "favorites" ? "Added to favorites." : "Added to watchlist.", "success");
      onLibraryChange?.();
    } catch (error) {
      showToast(error.response?.data?.message || "Could not update your library.", "error");
    }
  };

  return (
    <article className="cinema-card group relative overflow-hidden rounded-lg transition duration-300 hover:-translate-y-1">
      <Link to={`/details/${id}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#111722]">
          <img
            src={item.poster}
            alt={`${item.title} poster`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent opacity-95" />
          <div className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold uppercase text-white ring-1 ring-white/10">
            {item.type}
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-sm font-semibold text-white ring-1 ring-white/10">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </div>
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <Link to={`/details/${id}`}>
            <h3 className="line-clamp-1 text-base font-bold text-white transition group-hover:text-red-300">
              {item.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs uppercase text-neutral-400">
            {item.releaseYear} - {item.duration}
          </p>
        </div>

        {!compact ? (
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-neutral-300">{item.description}</p>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          {item.genre?.slice(0, compact ? 2 : 3).map((genre) => (
            <span
              key={genre}
              className="rounded-md bg-white/[0.08] px-2 py-1 text-xs text-neutral-200 ring-1 ring-white/5"
            >
              {genre}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_40px_40px] gap-2">
          <Link
            to={`/watch/${id}`}
            className="primary-action inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition"
          >
            <Play className="h-4 w-4" />
            Watch
          </Link>
          <button
            type="button"
            onClick={(event) => addToLibrary(event, "watchlist")}
            className="icon-action inline-flex items-center justify-center rounded-md transition"
            aria-label="Add to watchlist"
            title="Add to watchlist"
          >
            <BookmarkPlus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(event) => addToLibrary(event, "favorites")}
            className="icon-action inline-flex items-center justify-center rounded-md transition"
            aria-label="Add to favorites"
            title="Add to favorites"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ContentCard;
