import { useEffect, useState } from "react";
import {
  Users,
  Film,
  MessageSquare,
  ShieldAlert,
  TrendingUp,
  RefreshCw,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  getDashboardStatsApi,
  getDashboardRecentActivityApi,
} from "../api/dashboard";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import usePageMetadata from "../hooks/usePageMetadata";
import StatisticsCard from "../components/StatisticsCard";
import DashboardCard from "../components/DashboardCard";
import ErrorState from "../components/common/ErrorState";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/common/Button";

const DashboardPage = () => {
  usePageMetadata({
    title: "Dashboard Overview",
    description:
      "MovieVerse Admin System Dashboard Overview and Real-time Metrics",
  });

  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const { controller, signal } = createAbortController();
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [statsRes, activityRes] = await Promise.all([
          getDashboardStatsApi(signal),
          getDashboardRecentActivityApi(signal),
        ]);

        if (isMounted) {
          setStats(statsRes?.data || statsRes);
          setActivity(activityRes?.data || activityRes);
        }
      } catch (err) {
        if (!isCancellationError(err) && isMounted) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load dashboard statistics.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [retryKey]);

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="eyebrow">System Console</span>
            <span className="text-muted/40">•</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Operational
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
            Dashboard Overview
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Real-time status and operational metrics across MovieVerse.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setRetryKey((k) => k + 1)}
          loading={loading}
          icon={RefreshCw}
          aria-label="Refresh dashboard data"
        >
          Refresh Data
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <ErrorState
          title="Unable to load operational metrics"
          message={error}
          onRetry={() => setRetryKey((k) => k + 1)}
        />
      )}

      {/* Statistics Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          title="Registered Users"
          value={stats?.users?.total ?? 0}
          icon={Users}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/15"
          subtitle={
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              Active platform accounts
            </span>
          }
          loading={loading && !stats}
        />

        <StatisticsCard
          title="Total Catalogue"
          value={stats?.movies?.total ?? 0}
          icon={Film}
          iconColor="text-red-500"
          iconBg="bg-red-600/15"
          subtitle={
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">
                {stats?.movies?.published ?? 0} Published
              </span>
              <span className="text-muted">•</span>
              <span className="text-amber-400 font-semibold">
                {stats?.movies?.draft ?? 0} Drafts
              </span>
            </div>
          }
          loading={loading && !stats}
        />

        <StatisticsCard
          title="User Reviews"
          value={stats?.reviews?.total ?? 0}
          icon={MessageSquare}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/15"
          subtitle="Community ratings & feedback"
          loading={loading && !stats}
        />

        <StatisticsCard
          title="Flagged Reports"
          value={stats?.reports?.open ?? 0}
          icon={ShieldAlert}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/15"
          subtitle={
            <span className="text-red-400 font-semibold">
              {stats?.reports?.total ?? 0} total reports submitted
            </span>
          }
          loading={loading && !stats}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recently Added Movies */}
        <DashboardCard
          title="Recently Added Movies"
          icon={Film}
          badge="Latest 5"
          loading={loading && !activity}
        >
          {activity?.movies?.length > 0 ? (
            <div className="divide-y divide-theme/40">
              {activity.movies.map((movie) => (
                <div
                  key={movie._id || movie.slug}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-soft border border-theme">
                      {movie.poster ? (
                        <img
                          src={movie.poster?.url || movie.poster}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted">
                          <Film className="h-4 w-4" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-theme truncate">
                        {movie.title}
                      </p>
                      <p className="muted-copy text-[11px] capitalize">
                        {movie.contentType || "movie"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={movie.publishStatus || "published"} />
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="muted-copy py-6 text-center text-xs">
                No recent movies recorded.
              </p>
            )
          )}
        </DashboardCard>

        {/* Recently Registered Users */}
        <DashboardCard
          title="Recently Registered Users"
          icon={Users}
          badge="Latest 5"
          loading={loading && !activity}
        >
          {activity?.users?.length > 0 ? (
            <div className="divide-y divide-theme/40">
              {activity.users.map((usr) => (
                <div
                  key={usr._id || usr.username}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft border border-theme text-xs font-bold text-theme">
                      {usr.fullName?.charAt(0) ||
                        usr.username?.charAt(0) ||
                        "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-theme truncate">
                        {usr.fullName || usr.username}
                      </p>
                      <p className="muted-copy text-[11px] truncate">
                        @{usr.username}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={usr.role === "admin" ? "admin" : "default"}
                    label={usr.role}
                  />
                </div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="muted-copy py-6 text-center text-xs">
                No recent user registrations.
              </p>
            )
          )}
        </DashboardCard>
      </div>

      {/* Recent Reviews Feed */}
      {activity?.reviews?.length > 0 && (
        <DashboardCard
          title="Recent User Reviews"
          icon={MessageSquare}
          badge="Latest 5"
          loading={loading && !activity}
        >
          <div className="divide-y divide-theme/40">
            {activity.reviews.map((rev) => (
              <div
                key={rev._id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-theme truncate">
                      {rev.movie?.title || "Movie"}
                    </span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star
                        className="h-3 w-3 fill-current"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-bold">{rev.rating}/10</span>
                    </div>
                  </div>
                  <p className="muted-copy mt-0.5 text-xs line-clamp-1">
                    {rev.title || rev.review}
                  </p>
                  <p className="muted-copy mt-1 text-[10px]">
                    By @{rev.user?.username || "user"}
                  </p>
                </div>
                <StatusBadge status={rev.status || "published"} />
              </div>
            ))}
          </div>
        </DashboardCard>
      )}
    </div>
  );
};

export default DashboardPage;
