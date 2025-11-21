import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, Film, X } from "lucide-react";
import { getMoviesApi, deleteMovieApi, updateMovieApi } from "../api/movies";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import usePageMetadata from "../hooks/usePageMetadata";
import useDebounce from "../hooks/useDebounce";
import { useToast } from "../context/ToastContext";
import MovieTable from "../components/MovieTable";
import SearchInput from "../components/common/SearchInput";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Skeleton from "../components/common/Skeleton";
import Button from "../components/common/Button";
import { ROUTES } from "../constants/routes";

const MoviesPage = () => {
  usePageMetadata({
    title: "Movies & Media",
    description:
      "Manage movie catalogue, media assets and publication statuses",
  });

  const { showToast } = useToast();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  // Search input (live) and debounced value that drives API calls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Per-row publish loading state map: { [movieId]: boolean }
  const [publishingIds, setPublishingIds] = useState({});
  // Optimistic publish overrides: { [movieId]: "published" | "draft" }
  const [optimisticPublish, setOptimisticPublish] = useState({});

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    const { controller, signal } = createAbortController();
    let isMounted = true;

  // Keep filter, pagination, retry, and cancellation state in the list screen rather than the reusable table.
  const loadMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page,
          limit: 10,
          search: debouncedSearch || undefined,
          genre: selectedGenre || undefined,
          status: selectedStatus || undefined,
          sort: sortOrder,
        };

        const response = await getMoviesApi(params, signal);
        const data = response?.data || response;
        const paginationInfo = response?.meta || response?.pagination || {};

        if (isMounted) {
          setMovies(Array.isArray(data) ? data : []);
          setTotalPages(paginationInfo.totalPages || 1);
          setTotalMovies(
            paginationInfo.total || (Array.isArray(data) ? data.length : 0),
          );
          setOptimisticPublish({});
        }
      } catch (err) {
        if (!isCancellationError(err) && isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load movies catalogue.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMovies();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [
    page,
    debouncedSearch,
    selectedGenre,
    selectedStatus,
    sortOrder,
    retryKey,
  ]);

  // ─── Filter handlers — reset page on filter change ──────────────────────────
  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
    setPage(1);
  }, []);

  const handleGenreChange = useCallback((e) => {
    setSelectedGenre(e.target.value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOrder(e.target.value);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedStatus("");
    setSortOrder("newest");
    setPage(1);
  }, []);

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const targetId = deleteTarget._id || deleteTarget.id;
      await deleteMovieApi(targetId);
      showToast(
        `Movie "${deleteTarget.title}" deleted successfully.`,
        "success",
      );
      setDeleteTarget(null);

      // Navigate to previous page if this was the last movie on the current page
      if (movies.length <= 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setRetryKey((k) => k + 1);
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete movie.",
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Publish Toggle with optimistic UI + rollback ───────────────────────────
  const handleTogglePublish = async (movie) => {
    const movieId = movie._id || movie.id;
    if (publishingIds[movieId]) return; // prevent duplicate requests

    const currentStatus = optimisticPublish[movieId] ?? movie.publishStatus;
    const nextStatus = currentStatus === "published" ? "draft" : "published";

    setOptimisticPublish((prev) => ({ ...prev, [movieId]: nextStatus }));
    setPublishingIds((prev) => ({ ...prev, [movieId]: true }));

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
      // Rollback optimistic change
      setOptimisticPublish((prev) => ({ ...prev, [movieId]: currentStatus }));
      showToast(
        err.response?.data?.message || "Failed to update publication status.",
        "error",
      );
    } finally {
      setPublishingIds((prev) => ({ ...prev, [movieId]: false }));
    }
  };

  // Merge optimistic overrides into displayed list
  const displayedMovies = movies.map((movie) => {
    const movieId = movie._id || movie.id;
    return optimisticPublish[movieId] !== undefined
      ? { ...movie, publishStatus: optimisticPublish[movieId] }
      : movie;
  });

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (selectedGenre ? 1 : 0) +
    (selectedStatus ? 1 : 0) +
    (sortOrder !== "newest" ? 1 : 0);

  // Show subtle loading indicator in search box while debounce is pending
  const isSearchPending = searchQuery !== debouncedSearch;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <span className="eyebrow">Catalogue Management</span>
          <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
            Movies & Media
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Manage movie entries, posters, banners & publication settings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRetryKey((k) => k + 1)}
            loading={loading}
            icon={RefreshCw}
            aria-label="Refresh movies list"
          >
            Refresh
          </Button>

          <Link
            to={ROUTES.CREATE_MOVIE}
            className="primary-action inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-lg"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add New Movie
          </Link>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div
        className="cinema-panel rounded-2xl p-4 sm:p-6 space-y-4"
        role="search"
        aria-label="Movie search and filters"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={
              isSearchPending
                ? "Searching…"
                : "Search movies by title or synopsis…"
            }
          />

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              aria-label={`Clear all ${activeFilterCount} active filters`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-surface-soft/60 px-3 py-2 text-xs font-bold text-muted hover:text-theme transition"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear Filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label
              htmlFor="genre-filter"
              className="block text-[11px] font-bold text-muted mb-1"
            >
              Genre
            </label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={handleGenreChange}
              className="cinema-input py-2 px-3 text-xs"
            >
              <option value="">All Genres</option>
              {[
                "Action",
                "Adventure",
                "Animation",
                "Comedy",
                "Crime",
                "Drama",
                "Horror",
                "Sci-Fi",
                "Thriller",
              ].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="block text-[11px] font-bold text-muted mb-1"
            >
              Release Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={handleStatusChange}
              className="cinema-input py-2 px-3 text-xs"
            >
              <option value="">All Statuses</option>
              <option value="released">Released</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-filter"
              className="block text-[11px] font-bold text-muted mb-1"
            >
              Sort By
            </label>
            <select
              id="sort-filter"
              value={sortOrder}
              onChange={handleSortChange}
              className="cinema-input py-2 px-3 text-xs"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rated</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorState
          title="Unable to load movies"
          message={error}
          onRetry={() => setRetryKey((k) => k + 1)}
        />
      )}

      {/* Loading Skeletons */}
      {loading && !movies.length && (
        <div
          className="cinema-panel rounded-2xl p-6 space-y-4"
          aria-busy="true"
          aria-label="Loading movies catalogue"
        >
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movies Table / Cards */}
      {!loading && displayedMovies.length > 0 && (
        <div className="space-y-6">
          <MovieTable
            movies={displayedMovies}
            onDelete={(movie) => setDeleteTarget(movie)}
            onTogglePublish={handleTogglePublish}
            publishingIds={publishingIds}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalMovies}
            limit={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !isSearchPending &&
        !error &&
        displayedMovies.length === 0 && (
          <EmptyState
            icon={Film}
            title="No movies found"
            message={
              activeFilterCount > 0
                ? "No movies match your search or filter criteria. Try adjusting your search."
                : "No movies have been added to the catalogue yet."
            }
            action={
              activeFilterCount > 0 ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear All Filters
                </Button>
              ) : (
                <Link
                  to={ROUTES.CREATE_MOVIE}
                  className="primary-action inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add First
                  Movie
                </Link>
              )
            }
          />
        )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
        title="Delete Movie"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All associated reviews and wishlist records will also be removed. This cannot be undone.`}
        confirmText="Delete Movie"
      />
    </div>
  );
};

export default MoviesPage;
