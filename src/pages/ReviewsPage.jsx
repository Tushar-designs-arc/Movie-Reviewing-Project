import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquareWarning, RefreshCw, X } from "lucide-react";
import {
  deleteReviewApi,
  getReportedReviewsApi,
  updateReviewStatusApi,
} from "../api/reviews";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import useDebounce from "../hooks/useDebounce";
import usePageMetadata from "../hooks/usePageMetadata";
import { useToast } from "../context/ToastContext";
import ReviewTable from "../components/ReviewTable";
import SearchInput from "../components/common/SearchInput";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Skeleton from "../components/common/Skeleton";
import Button from "../components/common/Button";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;
const idOf = (review) => review?.reviewId || review?._id || review?.id;
const contains = (value, term) =>
  String(value || "")
    .toLowerCase()
    .includes(term.toLowerCase());

const ReviewsPage = () => {
  usePageMetadata({
    title: "Reviews Moderation",
    description: "Review and moderate reported MovieVerse reviews",
  });
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [movie, setMovie] = useState("");
  const [user, setUser] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [sort, setSort] = useState("reports");
  const [actionTarget, setActionTarget] = useState(null);
  const [pendingIds, setPendingIds] = useState({});
  const [filterTimestamp, setFilterTimestamp] = useState(0);
  const debouncedSearch = useDebounce(search, 400);
  useEffect(() => {
    const { controller, signal } = createAbortController();
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getReportedReviewsApi(
          { page, limit: 10, status: status || undefined },
          signal,
        );
        if (mounted) {
          setReviews(Array.isArray(response?.data) ? response.data : []);
          setMeta(response?.meta || { total: 0, totalPages: 1 });
        }
      } catch (requestError) {
        if (mounted && !isCancellationError(requestError))
          setError(
            errorMessage(requestError, "Failed to load reported reviews."),
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [page, status, retryKey]);
  const filteredReviews = useMemo(() => {
    const now = filterTimestamp;
    const withinDate = (createdAt) => {
      if (!dateRange) return true;
      const timestamp = new Date(createdAt).getTime();
      if (Number.isNaN(timestamp)) return false;
      const days = Number(dateRange);
      return timestamp >= now - days * 86400000;
    };
    const result = reviews.filter(
      (review) =>
        (!debouncedSearch ||
          contains(review.review, debouncedSearch) ||
          contains(review.movie?.title, debouncedSearch) ||
          contains(review.author?.fullName, debouncedSearch) ||
          contains(review.author?.username, debouncedSearch)) &&
        (!rating || Number(review.rating) === Number(rating)) &&
        (!movie || contains(review.movie?.title, movie)) &&
        (!user ||
          contains(review.author?.fullName, user) ||
          contains(review.author?.username, user)) &&
        withinDate(review.createdAt),
    );
    return [...result].sort((a, b) =>
      sort === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : sort === "oldest"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : Number(b.reportCount || 0) - Number(a.reportCount || 0),
    );
  }, [
    reviews,
    debouncedSearch,
    rating,
    movie,
    user,
    dateRange,
    sort,
    filterTimestamp,
  ]);
  const change = useCallback(
    (setter) => (event) => {
      setter(event.target.value);
      setPage(1);
    },
    [],
  );
  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("");
    setRating("");
    setMovie("");
    setUser("");
    setDateRange("");
    setFilterTimestamp(0);
    setSort("reports");
    setPage(1);
  }, []);
  const handleAction = async () => {
    const target = actionTarget?.review;
    const id = idOf(target);
    if (!target || !id || pendingIds[id]) return;
    const action = actionTarget.action;
    setPendingIds((current) => ({ ...current, [id]: true }));
    try {
      if (action === "delete") {
        await deleteReviewApi(id);
        setReviews((current) =>
          current.filter((review) => idOf(review) !== id),
        );
        showToast("Review deleted.", "success");
      } else {
        const statusValue = action === "hide" ? "hidden" : "published";
        await updateReviewStatusApi(id, statusValue);
        setReviews((current) =>
          current.map((review) =>
            idOf(review) === id ? { ...review, status: statusValue } : review,
          ),
        );
        showToast(
          `Review ${action === "hide" ? "hidden" : "restored"}.`,
          "success",
        );
      }
      setActionTarget(null);
    } catch (requestError) {
      showToast(
        errorMessage(requestError, "Unable to update review."),
        "error",
      );
    } finally {
      setPendingIds((current) => ({ ...current, [id]: false }));
    }
  };
  const activeFilters =
    [search, status, rating, movie, user, dateRange].filter(Boolean).length +
    Number(sort !== "reports");
  const actionLabel =
    actionTarget?.action === "delete"
      ? "Delete"
      : actionTarget?.action === "hide"
        ? "Hide"
        : "Restore";
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <span className="eyebrow">Content Moderation</span>
          <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
            Reviews Moderation
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Manage reviews that users have reported.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setRetryKey((key) => key + 1)}
          loading={loading}
          icon={RefreshCw}
        >
          Refresh
        </Button>
      </div>
      <section
        className="space-y-4 rounded-2xl cinema-panel p-4 sm:p-6"
        role="search"
        aria-label="Review search and filters"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder={
              search !== debouncedSearch
                ? "Searching…"
                : "Search reviews, movies or users…"
            }
          />
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-surface-soft/60 px-3 py-2 text-xs font-bold text-muted hover:text-theme"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filters ({activeFilters})
            </button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-[11px] font-bold text-muted">
            Review status
            <select
              value={status}
              onChange={change(setStatus)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="hidden">Hidden</option>
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Rating
            <select
              value={rating}
              onChange={change(setRating)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="">All ratings</option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} stars
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Movie
            <input
              value={movie}
              onChange={change(setMovie)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
              placeholder="Filter by movie"
            />
          </label>
          <label className="text-[11px] font-bold text-muted">
            User
            <input
              value={user}
              onChange={change(setUser)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
              placeholder="Filter by user"
            />
          </label>
          <label className="text-[11px] font-bold text-muted">
            Created
            <select
              value={dateRange}
              onChange={(event) => {
                setDateRange(event.target.value);
                setFilterTimestamp(Date.now());
                setPage(1);
              }}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="">Any time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Sort
            <select
              value={sort}
              onChange={change(setSort)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="reports">Most reported</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
        </div>
        <p className="text-[11px] text-muted">
          Showing reported reviews only; search, rating, movie, user, date and
          sort filters apply to the loaded page because the backend does not
          support them.
        </p>
      </section>
      {error && (
        <ErrorState
          title="Unable to load reported reviews"
          message={error}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      )}
      {loading && !reviews.length && (
        <div
          className="space-y-4 rounded-2xl cinema-panel p-6"
          aria-busy="true"
          aria-label="Loading reported reviews"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filteredReviews.length > 0 && (
        <>
          <ReviewTable
            reviews={filteredReviews}
            onAction={(action, review) => setActionTarget({ action, review })}
            pendingIds={pendingIds}
          />
          <Pagination
            page={page}
            totalPages={meta.totalPages || 1}
            total={meta.total || 0}
            limit={10}
            onPageChange={setPage}
          />
        </>
      )}
      {!loading && !error && filteredReviews.length === 0 && (
        <EmptyState
          icon={MessageSquareWarning}
          title="No reported reviews found"
          message={
            activeFilters
              ? "No reported reviews on this page match these filters."
              : "There are no reported reviews to moderate."
          }
          action={
            activeFilters ? (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : null
          }
        />
      )}
      <ConfirmDialog
        isOpen={Boolean(actionTarget)}
        onClose={() => setActionTarget(null)}
        onConfirm={handleAction}
        loading={Boolean(actionTarget && pendingIds[idOf(actionTarget.review)])}
        title={`${actionLabel} review`}
        message={
          actionTarget?.action === "delete"
            ? "This permanently deletes the review and its reactions."
            : `Are you sure you want to ${actionLabel.toLowerCase()} this review?`
        }
        confirmText={actionLabel}
        variant={
          actionTarget?.action === "delete" || actionTarget?.action === "hide"
            ? "danger"
            : "primary"
        }
      />
    </div>
  );
};
export default ReviewsPage;
