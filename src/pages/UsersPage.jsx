import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Users, X } from "lucide-react";
import { getUsersApi, updateUserStatusApi } from "../api/users";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import useDebounce from "../hooks/useDebounce";
import usePageMetadata from "../hooks/usePageMetadata";
import { useToast } from "../context/ToastContext";
import UserTable from "../components/UserTable";
import SearchInput from "../components/common/SearchInput";
import Pagination from "../components/common/Pagination";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import Skeleton from "../components/common/Skeleton";
import Button from "../components/common/Button";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const UsersPage = () => {
  usePageMetadata({
    title: "Users Management",
    description: "Search, review and manage MovieVerse user accounts",
  });
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [retryKey, setRetryKey] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [verified, setVerified] = useState("");
  const [sort, setSort] = useState("newest");
  const [target, setTarget] = useState(null);
  const [updatingIds, setUpdatingIds] = useState({});
  const debouncedSearch = useDebounce(search, 400);
  useEffect(() => {
    const { controller, signal } = createAbortController();
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUsersApi(
          {
            page,
            limit: 10,
            search: debouncedSearch || undefined,
            role: role || undefined,
            isActive: status || undefined,
            isVerified: verified || undefined,
            sort,
          },
          signal,
        );
        if (mounted) {
          setUsers(Array.isArray(response?.data) ? response.data : []);
          setMeta(response?.meta || { total: 0, totalPages: 1 });
        }
      } catch (requestError) {
        if (mounted && !isCancellationError(requestError))
          setError(errorMessage(requestError, "Failed to load users."));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [page, debouncedSearch, role, status, verified, sort, retryKey]);
  const change = useCallback(
    (setter) => (event) => {
      setter(event.target.value);
      setPage(1);
    },
    [],
  );
  const clearFilters = useCallback(() => {
    setSearch("");
    setRole("");
    setStatus("");
    setVerified("");
    setSort("newest");
    setPage(1);
  }, []);
  const confirmStatus = async () => {
    if (!target) return;
    const id = target._id || target.id;
    if (updatingIds[id]) return;
    const nextStatus = target.isActive === false;
    setUpdatingIds((current) => ({ ...current, [id]: true }));
    setUsers((current) =>
      current.map((user) =>
        (user._id || user.id) === id ? { ...user, isActive: nextStatus } : user,
      ),
    );
    try {
      await updateUserStatusApi(id, nextStatus);
      showToast(
        `${target.fullName || "User"} ${nextStatus ? "activated" : "suspended"}.`,
        "success",
      );
      setTarget(null);
    } catch (requestError) {
      setUsers((current) =>
        current.map((user) =>
          (user._id || user.id) === id
            ? { ...user, isActive: target.isActive }
            : user,
        ),
      );
      showToast(
        errorMessage(requestError, "Unable to update account status."),
        "error",
      );
    } finally {
      setUpdatingIds((current) => ({ ...current, [id]: false }));
    }
  };
  const activeFilters =
    Number(Boolean(search)) +
    Number(Boolean(role)) +
    Number(Boolean(status)) +
    Number(Boolean(verified)) +
    Number(sort !== "newest");
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <span className="eyebrow">Account Administration</span>
          <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
            Users Management
          </h1>
          <p className="muted-copy mt-1 text-xs">
            Search accounts and manage account access.
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
        aria-label="User search and filters"
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
                : "Search name, username or email…"
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
            Role
            <select
              value={role}
              onChange={change(setRole)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="">All roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Account status
            <select
              value={status}
              onChange={change(setStatus)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="">All statuses</option>
              <option value="true">Active</option>
              <option value="false">Suspended</option>
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Email verification
            <select
              value={verified}
              onChange={change(setVerified)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="">All verification states</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </label>
          <label className="text-[11px] font-bold text-muted">
            Sort
            <select
              value={sort}
              onChange={change(setSort)}
              className="cinema-input mt-1 px-3 py-2 text-xs"
            >
              <option value="newest">Newest joined</option>
              <option value="oldest">Oldest joined</option>
              <option value="username">Username</option>
              <option value="lastLogin">Last login</option>
            </select>
          </label>
        </div>
      </section>
      {error && (
        <ErrorState
          title="Unable to load users"
          message={error}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      )}
      {loading && !users.length && (
        <div
          className="space-y-4 rounded-2xl cinema-panel p-6"
          aria-busy="true"
          aria-label="Loading users"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && users.length > 0 && (
        <>
          <UserTable
            users={users}
            onToggleStatus={setTarget}
            updatingIds={updatingIds}
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
      {!loading && !error && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="No users found"
          message={
            activeFilters
              ? "No accounts match these filters."
              : "There are no user accounts yet."
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
        isOpen={Boolean(target)}
        onClose={() => setTarget(null)}
        onConfirm={confirmStatus}
        loading={target ? Boolean(updatingIds[target._id || target.id]) : false}
        title={
          target?.isActive === false ? "Activate account" : "Suspend account"
        }
        message={`Are you sure you want to ${target?.isActive === false ? "activate" : "suspend"} ${target?.fullName || "this user"}?`}
        confirmText={target?.isActive === false ? "Activate" : "Suspend"}
        variant={target?.isActive === false ? "primary" : "danger"}
      />
    </div>
  );
};
export default UsersPage;
