import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  CheckCircle2,
  Star,
  Eye,
  Clock,
  Globe,
  Calendar,
  Film,
  Play,
  LoaderCircle,
  Loader2,
} from "lucide-react";
import { getMovieByIdApi, deleteMovieApi, updateMovieApi } from "../api/movies";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import { useToast } from "../context/ToastContext";
import usePageMetadata from "../hooks/usePageMetadata";
import StatusBadge from "../components/common/StatusBadge";
import ConfirmDialog from "../components/common/ConfirmDialog";
import ErrorState from "../components/common/ErrorState";
import { ROUTES } from "../constants/routes";
import { formatDuration, formatNumber } from "../utils/formatters";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  usePageMetadata({
    title: movie ? `${movie.title} — Details` : "Movie Details",
    description: movie?.description
      ? movie.description.slice(0, 150)
      : "MovieVerse Admin — Movie Details",
  });

  useEffect(() => {
    const { controller, signal } = createAbortController();
    let isMounted = true;

    const loadMovie = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getMovieByIdApi(id, signal);
        const data = response?.data || response;
        if (isMounted) setMovie(data);
      } catch (err) {
        if (!isCancellationError(err) && isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load movie details.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMovie();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, retryKey]);

  const handleDelete = async () => {
    if (!movie) return;
    setIsDeleting(true);
    try {
      const movieId = movie._id || id;
      await deleteMovieApi(movieId);
      showToast(`Movie "${movie.title}" deleted successfully.`, "success");
      navigate(ROUTES.MOVIES, { replace: true });
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete movie.",
        "error",
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!movie || isPublishing) return;
    const movieId = movie._id || id;
    const currentStatus = movie.publishStatus;
    const nextStatus = currentStatus === "published" ? "draft" : "published";

    // Optimistic update
    setMovie((prev) => ({ ...prev, publishStatus: nextStatus }));
    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append("publishStatus", nextStatus);
      formData.append("title", movie.title);
      formData.append("description", movie.description);
      formData.append("releaseDate", movie.releaseDate);
      formData.append("duration", movie.duration);
      formData.append("country", movie.country || "");
      formData.append("director", movie.director || "");

      await updateMovieApi(movieId, formData);
      showToast(`"${movie.title}" is now ${nextStatus}.`, "success");
    } catch (err) {
      // Rollback on failure
      setMovie((prev) => ({ ...prev, publishStatus: currentStatus }));
      showToast(
        err.response?.data?.message || "Failed to update publication status.",
        "error",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div
        className="section-shell grid min-h-[50vh] place-items-center py-16"
        aria-busy="true"
        aria-label="Loading movie details"
      >
        <div className="cinema-panel flex flex-col items-center rounded-2xl p-8 text-center shadow-2xl">
          <LoaderCircle
            className="h-8 w-8 animate-spin text-red-500"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm font-bold text-theme">
            Loading Movie Details…
          </p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="space-y-6">
        <Link
          to={ROUTES.MOVIES}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-theme transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to
          Movies Catalogue
        </Link>
        <ErrorState
          title="Movie Details Unavailable"
          message={error || "The requested movie entry could not be found."}
          onRetry={() => setRetryKey((k) => k + 1)}
        />
      </div>
    );
  }

  const movieId = movie._id || id;
  const isPublished = movie.publishStatus === "published";

  return (
    <div className="space-y-8">
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <Link
            to={ROUTES.MOVIES}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-theme transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to
            Movies Catalogue
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-black text-theme sm:text-3xl">
              {movie.title}
            </h1>
            <StatusBadge status={movie.publishStatus || "published"} />
          </div>
        </div>

        <div
          className="flex flex-wrap items-center gap-3"
          role="group"
          aria-label="Movie actions"
        >
          <button
            type="button"
            onClick={handleTogglePublish}
            disabled={isPublishing}
            className="secondary-action inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label={
              isPublishing
                ? "Updating publication status…"
                : isPublished
                  ? "Unpublish to Draft"
                  : "Publish to Website"
            }
            aria-disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            )}
            {isPublished ? "Unpublish to Draft" : "Publish to Website"}
          </button>

          <Link
            to={`/movies/${movieId}/edit`}
            className="primary-action inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-lg"
            aria-label={`Edit ${movie.title}`}
          >
            <Edit3 className="h-4 w-4" aria-hidden="true" /> Edit Movie
          </Link>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-600/15 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-600/30 transition"
            aria-label={`Delete ${movie.title}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="cinema-panel relative overflow-hidden rounded-3xl p-6 sm:p-10 shadow-2xl">
        {(movie.banner?.url || movie.banner) && (
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <img
              src={movie.banner?.url || movie.banner}
              alt=""
              className="h-full w-full object-cover opacity-20 filter blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          </div>
        )}

        <div className="relative z-10 grid gap-8 md:grid-cols-4 items-start">
          {/* Poster */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-48 h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-theme bg-surface-soft shrink-0">
              {movie.poster?.url || movie.poster ? (
                <img
                  src={movie.poster?.url || movie.poster}
                  alt={`${movie.title} poster`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-muted"
                  aria-hidden="true"
                >
                  <Film className="h-8 w-8" />
                </div>
              )}
            </div>
          </div>

          {/* Core Info */}
          <div className="md:col-span-3 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted mb-2">
                <span className="capitalize text-theme bg-surface-soft border border-theme px-2.5 py-1 rounded-lg">
                  {movie.contentType || "Movie"}
                </span>
                <span aria-hidden="true">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).getFullYear()
                    : "N/A"}
                </span>
                <span aria-hidden="true">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatDuration(movie.duration)}
                </span>
                <span aria-hidden="true">•</span>
                <span className="bg-surface-soft border border-theme px-2 py-0.5 rounded text-[11px]">
                  {movie.certificate || "UA"}
                </span>
              </div>

              <h2 className="text-3xl font-black text-theme sm:text-4xl">
                {movie.title}
              </h2>
              {movie.tagline && (
                <p className="eyebrow mt-1 text-red-500 font-bold">
                  {movie.tagline}
                </p>
              )}
            </div>

            <p className="muted-copy text-sm leading-relaxed max-w-3xl">
              {movie.description}
            </p>

            {/* Metrics */}
            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-theme/60">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400"
                  aria-hidden="true"
                >
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <p
                    className="text-sm font-black text-theme"
                    aria-label={`Average rating: ${movie.averageRating ? movie.averageRating.toFixed(1) : "0.0"} out of 5`}
                  >
                    {movie.averageRating
                      ? movie.averageRating.toFixed(1)
                      : "0.0"}{" "}
                    / 5.0
                  </p>
                  <p className="muted-copy text-[11px]">
                    {movie.totalReviews || 0} User Reviews
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400"
                  aria-hidden="true"
                >
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-theme">
                    {formatNumber(movie.viewCount, "0")}
                  </p>
                  <p className="muted-copy text-[11px]">Total Views</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400"
                  aria-hidden="true"
                >
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-theme">
                    {movie.country || "N/A"}
                  </p>
                  <p className="muted-copy text-[11px]">Country of Origin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Genres & Languages */}
        <section
          className="cinema-panel rounded-3xl p-6 space-y-4"
          aria-labelledby="genres-heading"
        >
          <h3
            id="genres-heading"
            className="text-base font-bold text-theme border-b border-theme pb-3"
          >
            Genres & Languages
          </h3>
          <div>
            <span className="text-xs font-bold text-muted block mb-2">
              Genres
            </span>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(movie.genres) && movie.genres.length > 0 ? (
                movie.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-xl border border-theme bg-surface-soft px-3 py-1 text-xs font-bold text-theme"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted">No genres specified</span>
              )}
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-muted block mb-2">
              Available Languages
            </span>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(movie.languages) && movie.languages.length > 0 ? (
                movie.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-xl border border-theme bg-surface-soft/60 px-3 py-1 text-xs font-semibold capitalize text-muted"
                  >
                    {l}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted">
                  No languages specified
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Cast & Crew */}
        <section
          className="cinema-panel rounded-3xl p-6 space-y-4"
          aria-labelledby="cast-heading"
        >
          <h3
            id="cast-heading"
            className="text-base font-bold text-theme border-b border-theme pb-3"
          >
            Cast & Crew
          </h3>
          <div>
            <span className="text-xs font-bold text-muted block">Director</span>
            <p className="text-sm font-bold text-theme mt-0.5">
              {movie.director || "Unknown"}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-muted block">
              Starring Cast
            </span>
            <p className="text-xs font-medium text-theme mt-0.5 leading-relaxed">
              {Array.isArray(movie.cast) && movie.cast.length > 0
                ? movie.cast.join(", ")
                : "N/A"}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-muted block">
              Production Studios
            </span>
            <p className="text-xs font-medium text-theme mt-0.5">
              {Array.isArray(movie.productionCompanies) &&
              movie.productionCompanies.length > 0
                ? movie.productionCompanies.join(", ")
                : "N/A"}
            </p>
          </div>
        </section>
      </div>

      {/* Trailer */}
      {movie.trailer && (
        <section
          className="cinema-panel rounded-3xl p-6"
          aria-labelledby="trailer-heading"
        >
          <div className="flex items-center justify-between border-b border-theme pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Play
                className="h-5 w-5 text-red-500 fill-current"
                aria-hidden="true"
              />
              <h3
                id="trailer-heading"
                className="text-base font-bold text-theme"
              >
                Official YouTube Trailer
              </h3>
            </div>
            <a
              href={movie.trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-action inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold"
              aria-label={`Watch ${movie.title} trailer on YouTube (opens in new tab)`}
            >
              Open in YouTube
            </a>
          </div>
          <p className="text-xs text-muted font-mono break-all">
            {movie.trailer}
          </p>
        </section>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Movie Record"
        message={`Are you sure you want to permanently delete "${movie.title}"? All associated reviews, ratings, wishlist and favourites will also be removed. This cannot be undone.`}
        confirmText="Delete Record"
      />
    </div>
  );
};

export default MovieDetailsPage;
