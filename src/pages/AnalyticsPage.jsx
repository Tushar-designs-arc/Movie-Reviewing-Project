import { useEffect, useState } from "react";
import {
  BarChart3,
  Film,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  Star,
  TrendingUp,
  Users,
  Eye,
} from "lucide-react";
import {
  getDashboardAnalyticsApi,
  getDashboardRecentActivityApi,
  getDashboardStatsApi,
} from "../api/dashboard";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import usePageMetadata from "../hooks/usePageMetadata";
import Card from "../components/common/Card";
import StatisticsCard from "../components/StatisticsCard";
import StatusBadge from "../components/common/StatusBadge";
import Skeleton from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { formatDateTime } from "../utils/date";

const safeNumber = (value) =>
  Number.isFinite(Number(value)) ? Number(value) : null;
const text = (value, fallback = "Not available from current backend.") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);
const Metric = ({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  subtitle,
  loading,
}) => (
  <StatisticsCard
    title={title}
    value={value === null || value === undefined ? "Not available" : value}
    icon={icon}
    iconColor={iconColor}
    iconBg={iconBg}
    subtitle={subtitle}
    loading={loading}
  />
);
const MovieList = ({ title, movies, metric, icon: Icon, loading }) => (
  <Card
    title={title}
    action={<Icon className="h-5 w-5 text-muted" aria-hidden="true" />}
  >
    {loading ? (
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    ) : movies?.length ? (
      <ol className="divide-y divide-theme/40">
        {movies.map((movie, index) => (
          <li
            key={movie._id || movie.slug || `${movie.title}-${index}`}
            className="flex items-center justify-between gap-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-theme">
                {text(movie.title)}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {safeNumber(movie.totalReviews) ?? "Not available"} reviews
              </p>
            </div>
            <span className="shrink-0 text-xs font-bold text-theme">
              {metric(movie)}
            </span>
          </li>
        ))}
      </ol>
    ) : (
      <p className="muted-copy py-5 text-center text-xs">
        Not available from current backend.
      </p>
    )}
  </Card>
);

const AnalyticsPage = () => {
  usePageMetadata({
    title: "Analytics",
    description: "MovieVerse platform performance and activity analytics",
  });
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  useEffect(() => {
    const { controller, signal } = createAbortController();
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsResponse, analyticsResponse, activityResponse] =
          await Promise.all([
            getDashboardStatsApi(signal),
            getDashboardAnalyticsApi(signal),
            getDashboardRecentActivityApi(signal),
          ]);
        if (active) {
          setStats(statsResponse?.data || statsResponse);
          setAnalytics(analyticsResponse?.data || analyticsResponse);
          setActivity(activityResponse?.data || activityResponse);
        }
      } catch (requestError) {
        if (active && !isCancellationError(requestError))
          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Failed to load analytics.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [retryKey]);
  const averageRating = analytics?.highestRatedMovies?.length
    ? analytics.highestRatedMovies.reduce(
        (sum, movie) => sum + (safeNumber(movie.averageRating) || 0),
        0,
      ) / analytics.highestRatedMovies.length
    : null;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <span className="eyebrow">Platform Insights</span>
          <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
            Analytics
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Live metrics from the MovieVerse administration API.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          loading={loading}
          onClick={() => setRetryKey((key) => key + 1)}
        >
          Refresh
        </Button>
      </div>
      {error && (
        <ErrorState
          title="Unable to load analytics"
          message={error}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      )}
      <section aria-labelledby="overview-heading">
        <h2
          id="overview-heading"
          className="mb-4 text-lg font-black text-theme"
        >
          Overview metrics
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            title="Total users"
            value={safeNumber(stats?.users?.total)}
            icon={Users}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/15"
            subtitle="Active user count is not available from current backend."
            loading={loading && !stats}
          />
          <Metric
            title="Movies"
            value={safeNumber(stats?.movies?.total)}
            icon={Film}
            iconColor="text-red-500"
            iconBg="bg-red-500/15"
            subtitle={`${safeNumber(stats?.movies?.published) ?? "Not available"} published · ${safeNumber(stats?.movies?.draft) ?? "Not available"} drafts`}
            loading={loading && !stats}
          />
          <Metric
            title="Reviews"
            value={safeNumber(stats?.reviews?.total)}
            icon={MessageSquare}
            iconColor="text-amber-400"
            iconBg="bg-amber-500/15"
            subtitle="Community reviews"
            loading={loading && !stats}
          />
          <Metric
            title="Open reports"
            value={safeNumber(stats?.reports?.open)}
            icon={ShieldAlert}
            iconColor="text-purple-400"
            iconBg="bg-purple-500/15"
            subtitle={`${safeNumber(stats?.reports?.total) ?? "Not available"} total reports`}
            loading={loading && !stats}
          />
        </div>
      </section>
      <section aria-labelledby="movie-heading">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-red-500" aria-hidden="true" />
          <h2 id="movie-heading" className="text-lg font-black text-theme">
            Movie analytics
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <MovieList
            title="Most viewed"
            movies={analytics?.mostViewedMovies}
            metric={(movie) => `${safeNumber(movie.viewCount) ?? "N/A"} views`}
            icon={Eye}
            loading={loading && !analytics}
          />
          <MovieList
            title="Highest rated"
            movies={analytics?.highestRatedMovies}
            metric={(movie) =>
              `${safeNumber(movie.averageRating)?.toFixed(1) ?? "N/A"}/5`
            }
            icon={Star}
            loading={loading && !analytics}
          />
          <MovieList
            title="Most reviewed"
            movies={analytics?.mostReviewedMovies}
            metric={(movie) =>
              `${safeNumber(movie.totalReviews) ?? "N/A"} reviews`
            }
            icon={MessageSquare}
            loading={loading && !analytics}
          />
        </div>
      </section>
      <section aria-labelledby="community-heading">
        <h2
          id="community-heading"
          className="mb-4 text-lg font-black text-theme"
        >
          Community analytics
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Average top-movie rating">
            <p className="text-3xl font-black text-theme">
              {averageRating === null
                ? "Not available"
                : `${averageRating.toFixed(1)}/5`}
            </p>
            <p className="muted-copy mt-2 text-xs">
              Calculated from the highest-rated movies returned by the backend.
            </p>
          </Card>
          <Card title="Review analytics">
            <p className="text-3xl font-black text-theme">
              {safeNumber(stats?.reviews?.total) ?? "Not available"}
            </p>
            <p className="muted-copy mt-2 text-xs">
              Total reviews are available; review growth is not exposed.
            </p>
          </Card>
          <Card title="Reports analytics">
            <p className="text-3xl font-black text-theme">
              {safeNumber(stats?.reports?.open) ?? "Not available"}
            </p>
            <p className="muted-copy mt-2 text-xs">
              Open reports of{" "}
              {safeNumber(stats?.reports?.total) ?? "not available"} total
              reports.
            </p>
          </Card>
        </div>
      </section>
      <section aria-labelledby="activity-heading">
        <h2
          id="activity-heading"
          className="mb-4 text-lg font-black text-theme"
        >
          Recent activity
        </h2>
        <Card>
          <div aria-live="polite">
            {loading && !activity ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="h-12 w-full" />
                ))}
              </div>
            ) : activity &&
              ["users", "movies", "reviews"].some(
                (key) => activity[key]?.length,
              ) ? (
              <div className="divide-y divide-theme/40">
                {[
                  ...(activity.users || []).map((item) => ({
                    kind: "User",
                    label: text(item.fullName, item.username),
                    createdAt: item.createdAt,
                    status: item.role,
                  })),
                  ...(activity.movies || []).map((item) => ({
                    kind: "Movie",
                    label: text(item.title),
                    createdAt: item.createdAt,
                    status: item.publishStatus,
                  })),
                  ...(activity.reviews || []).map((item) => ({
                    kind: "Review",
                    label: text(item.title, item.movie?.title),
                    createdAt: item.createdAt,
                    status: item.status,
                  })),
                ]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 10)
                  .map((item, index) => (
                    <div
                      key={`${item.kind}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-3 py-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-theme">
                          {item.kind}: {item.label}
                        </p>
                        <p className="text-xs text-muted">
                          {formatDateTime(
                            item.createdAt,
                            "Not available from current backend.",
                          )}
                        </p>
                      </div>
                      <StatusBadge status={item.status || "default"} />
                    </div>
                  ))}
              </div>
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No recent activity"
                message="Not available from current backend."
              />
            )}
          </div>
        </Card>
      </section>
    </div>
  );
};
export default AnalyticsPage;
