import { Link } from "react-router-dom";
import {
  Eye,
  Edit3,
  Trash2,
  Star,
  Film,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import StatusBadge from "./common/StatusBadge";
import { formatDuration } from "../utils/formatters";

const MovieTable = ({
  movies = [],
  onDelete,
  onTogglePublish,
  publishingIds = {},
}) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Desktop / Tablet Table View */}
      <div className="hidden md:block cinema-panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table
            className="w-full text-left text-xs"
            aria-label="Movies catalogue"
          >
            <thead className="border-b border-theme bg-surface-soft/60 uppercase tracking-wider text-muted font-bold">
              <tr>
                <th scope="col" className="py-3.5 px-4">
                  Movie
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Type & Genre
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Duration
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Rating
                </th>
                <th scope="col" className="py-3.5 px-4">
                  Status
                </th>
                <th scope="col" className="py-3.5 px-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme/40 font-medium">
              {movies.map((movie) => {
                const movieId = movie._id || movie.id;
                const isPublished = movie.publishStatus === "published";
                const isPublishing = Boolean(publishingIds[movieId]);

                return (
                  <tr
                    key={movieId}
                    className="hover:bg-surface-soft/30 transition-colors"
                  >
                    {/* Title & Poster */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-surface-soft border border-theme">
                          {movie.poster?.url || movie.poster ? (
                            <img
                              src={movie.poster?.url || movie.poster}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div
                              className="flex h-full w-full items-center justify-center text-muted"
                              aria-hidden="true"
                            >
                              <Film className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/movies/${movieId}`}
                            className="font-bold text-theme hover:text-red-500 transition line-clamp-1"
                          >
                            {movie.title}
                          </Link>
                          <p className="muted-copy text-[11px] truncate">
                            {movie.releaseDate
                              ? new Date(movie.releaseDate).getFullYear()
                              : "N/A"}{" "}
                            • {movie.director || "Unknown Director"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Content Type & Genres */}
                    <td className="py-3 px-4">
                      <span className="font-bold capitalize text-theme">
                        {movie.contentType || "Movie"}
                      </span>
                      <p className="muted-copy text-[11px] line-clamp-1">
                        {Array.isArray(movie.genres)
                          ? movie.genres.join(", ")
                          : "N/A"}
                      </p>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-muted font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{formatDuration(movie.duration)}</span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4">
                      <div
                        className="flex items-center gap-1 text-amber-400 font-bold"
                        aria-label={`Rating: ${movie.averageRating ? movie.averageRating.toFixed(1) : "0.0"} out of 5`}
                      >
                        <Star
                          className="h-3.5 w-3.5 fill-current"
                          aria-hidden="true"
                        />
                        <span>
                          {movie.averageRating
                            ? movie.averageRating.toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-muted text-[10px] font-normal">
                          ({movie.totalReviews || 0})
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={movie.publishStatus || "published"}
                      />
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        role="group"
                        aria-label={`Actions for ${movie.title}`}
                      >
                        <Link
                          to={`/movies/${movieId}`}
                          className="icon-action rounded-lg p-2 text-muted hover:text-theme transition"
                          aria-label={`View details for ${movie.title}`}
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>

                        <Link
                          to={`/movies/${movieId}/edit`}
                          className="icon-action rounded-lg p-2 text-muted hover:text-theme transition"
                          aria-label={`Edit ${movie.title}`}
                        >
                          <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>

                        {onTogglePublish && (
                          <button
                            type="button"
                            onClick={() => onTogglePublish(movie)}
                            disabled={isPublishing}
                            className="icon-action rounded-lg p-2 text-muted hover:text-theme transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={
                              isPublishing
                                ? "Updating status…"
                                : isPublished
                                  ? `Unpublish ${movie.title}`
                                  : `Publish ${movie.title}`
                            }
                            aria-disabled={isPublishing}
                          >
                            {isPublishing ? (
                              <Loader2
                                className="h-3.5 w-3.5 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <CheckCircle2
                                className={`h-3.5 w-3.5 ${isPublished ? "text-emerald-400" : "text-amber-400"}`}
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onDelete(movie)}
                          className="icon-action rounded-lg p-2 text-red-400 hover:bg-red-600/20 hover:text-red-500 transition"
                          aria-label={`Delete ${movie.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Grid View */}
      <div
        className="grid gap-4 sm:grid-cols-2 md:hidden"
        aria-label="Movies catalogue cards"
      >
        {movies.map((movie) => {
          const movieId = movie._id || movie.id;

          return (
            <article
              key={movieId}
              className="cinema-panel rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-soft border border-theme">
                    {movie.poster?.url || movie.poster ? (
                      <img
                        src={movie.poster?.url || movie.poster}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center text-muted"
                        aria-hidden="true"
                      >
                        <Film className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/movies/${movieId}`}
                      className="font-bold text-sm text-theme hover:text-red-500 line-clamp-1"
                    >
                      {movie.title}
                    </Link>
                    <p className="muted-copy text-xs mt-0.5 capitalize">
                      {movie.contentType || "movie"} •{" "}
                      {formatDuration(movie.duration)}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <StatusBadge
                        status={movie.publishStatus || "published"}
                      />
                      <div
                        className="flex items-center gap-1 text-amber-400 text-xs font-bold"
                        aria-label={`Rating ${movie.averageRating ? movie.averageRating.toFixed(1) : "0.0"}`}
                      >
                        <Star
                          className="h-3.5 w-3.5 fill-current"
                          aria-hidden="true"
                        />
                        <span>
                          {movie.averageRating
                            ? movie.averageRating.toFixed(1)
                            : "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-4 pt-3 border-t border-theme/50 flex items-center justify-between"
                role="group"
                aria-label={`Actions for ${movie.title}`}
              >
                <Link
                  to={`/movies/${movieId}`}
                  className="text-xs font-bold text-red-500 hover:underline inline-flex items-center gap-1"
                  aria-label={`View details for ${movie.title}`}
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Details
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/movies/${movieId}/edit`}
                    className="secondary-action rounded-lg px-2.5 py-1 text-xs font-semibold"
                    aria-label={`Edit ${movie.title}`}
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(movie)}
                    className="rounded-lg bg-red-600/15 border border-red-500/30 px-2.5 py-1 text-xs font-semibold text-red-400 hover:bg-red-600/30"
                    aria-label={`Delete ${movie.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default MovieTable;
