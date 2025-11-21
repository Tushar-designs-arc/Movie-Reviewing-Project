import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, ShieldAlert, X } from "lucide-react";
import { getReportsApi } from "../api/reports";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import useDebounce from "../hooks/useDebounce";
import usePageMetadata from "../hooks/usePageMetadata";
import ReportsTable from "../components/ReportsTable";
import SearchInput from "../components/common/SearchInput";
import Pagination from "../components/common/Pagination";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Skeleton from "../components/common/Skeleton";
import Button from "../components/common/Button";

const message = (error) =>
  error?.response?.data?.message || error?.message || "Failed to load reports.";
const contains = (value, term) =>
  String(value || "")
    .toLowerCase()
    .includes(term.toLowerCase());
const hasReason = (report, reason) =>
  !reason || report.reasonSummary?.some((item) => item.reason === reason);

const ReportsPage = () => {
  usePageMetadata({
    title: "Flagged Reports",
    description: "Review the MovieVerse reported-content queue",
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState("report");
  const [dateRange, setDateRange] = useState("");
  const [sort, setSort] = useState("latest");
  const [filterTimestamp, setFilterTimestamp] = useState(0);
  const debouncedSearch = useDebounce(search, 400);
  useEffect(() => {
    const { controller, signal } = createAbortController();
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getReportsApi(
          {
            page,
            limit: 10,
            status: status || undefined,
            reason: reason || undefined,
          },
          signal,
        );
        if (active) {
          setReports(Array.isArray(response?.data) ? response.data : []);
          setMeta(response?.meta || { total: 0, totalPages: 1 });
        }
      } catch (requestError) {
        if (active && !isCancellationError(requestError))
          setError(message(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [page, status, reason, retryKey]);
  const visible = useMemo(() => {
    const matchesDate = (value) => {
      if (!dateRange) return true;
      const time = new Date(value).getTime();
      return (
        !Number.isNaN(time) &&
        time >= filterTimestamp - Number(dateRange) * 86400000
      );
    };
    return [
      ...reports
        .filter(
          (report) =>
            (!debouncedSearch ||
              contains(report.review, debouncedSearch) ||
              contains(report.movie?.title, debouncedSearch) ||
              contains(report.author?.fullName, debouncedSearch)) &&
            hasReason(report, reason) &&
            type === "report" &&
            matchesDate(report.latestReportAt),
        )
        .sort((a, b) =>
          sort === "count"
            ? Number(b.reportCount || 0) - Number(a.reportCount || 0)
            : sort === "oldest"
              ? new Date(a.latestReportAt) - new Date(b.latestReportAt)
              : new Date(b.latestReportAt) - new Date(a.latestReportAt),
        ),
    ];
  }, [
    reports,
    debouncedSearch,
    reason,
    type,
    dateRange,
    filterTimestamp,
    sort,
  ]);
  const change = useCallback(
    (setter) => (event) => {
      setter(event.target.value);
      setPage(1);
    },
    [],
  );
  const clear = useCallback(() => {
    setSearch("");
    setStatus("");
    setReason("");
    setType("report");
    setDateRange("");
    setFilterTimestamp(0);
    setSort("latest");
    setPage(1);
  }, []);
  const activeFilters =
    [search, status, reason, dateRange].filter(Boolean).length +
    Number(sort !== "latest");
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <span className="eyebrow">Content Moderation</span>
          <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
            Flagged Reports
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Grouped reports for reported reviews.
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
        aria-label="Report search and filters"
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
                : "Search review, movie or user…"
            }
          />
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clear}
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
            Reason
            <select
              value={reason}
              onChange={change(setReason)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="">All reasons</option>
              {[
                "spam",
                "harassment",
                "hate_speech",
                "misinformation",
                "adult_content",
                "other",
              ].map((value) => (
                <option key={value} value={value}>
                  {value.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Report type
            <select
              value={type}
              onChange={change(setType)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="report">Review report</option>
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Date
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
              <option value="latest">Latest report</option>
              <option value="oldest">Oldest report</option>
              <option value="count">Most reports</option>
            </select>
          </label>
        </div>
        <p className="text-[11px] text-muted">
          The API supplies grouped review reports. Search, date and sort apply
          to this loaded page; individual report actions are not available from
          the backend.
        </p>
      </section>
      {error && (
        <ErrorState
          title="Unable to load reports"
          message={error}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      )}
      {loading && !reports.length && (
        <div
          className="space-y-4 rounded-2xl cinema-panel p-6"
          aria-busy="true"
          aria-label="Loading reports"
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
      {!loading && visible.length > 0 && (
        <>
          <ReportsTable reports={visible} />
          <Pagination
            page={page}
            totalPages={meta.totalPages || 1}
            total={meta.total || 0}
            limit={10}
            onPageChange={setPage}
          />
        </>
      )}
      {!loading && !error && visible.length === 0 && (
        <EmptyState
          icon={ShieldAlert}
          title="No reports found"
          message={
            activeFilters
              ? "No reports on this page match these filters."
              : "There are no reported reviews."
          }
          action={
            activeFilters ? (
              <Button variant="secondary" size="sm" onClick={clear}>
                Clear filters
              </Button>
            ) : null
          }
        />
      )}
    </div>
  );
};
export default ReportsPage;
