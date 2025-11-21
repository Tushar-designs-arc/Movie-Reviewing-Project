import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ListPlus,
  MessageSquare,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { getUserDetailsApi, updateUserStatusApi } from "../api/users";
import { createAbortController } from "../utils/createAbortController";
import { isCancellationError } from "../utils/apiError";
import usePageMetadata from "../hooks/usePageMetadata";
import { useToast } from "../context/ToastContext";
import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import Skeleton from "../components/common/Skeleton";
import ErrorState from "../components/common/ErrorState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Button from "../components/common/Button";
import { ROUTES } from "../constants/routes";
import { formatDateTime } from "../utils/date";

const safeText = (value, fallback = "Not available") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);
const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;
const Detail = ({ label, value }) => (
  <div>
    <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">
      {label}
    </dt>
    <dd className="mt-1 break-words text-sm font-semibold text-theme">
      {value}
    </dd>
  </div>
);

const UserDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [updating, setUpdating] = useState(false);
  usePageMetadata({
    title: user?.fullName ? `${user.fullName} | Users` : "User details",
    description: "Review MovieVerse user account information",
  });
  useEffect(() => {
    const { controller, signal } = createAbortController();
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUserDetailsApi(id, signal);
        if (mounted) setUser(response?.data || null);
      } catch (requestError) {
        if (mounted && !isCancellationError(requestError))
          setError(errorMessage(requestError, "Failed to load user details."));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id, retryKey]);
  const updateStatus = async () => {
    if (!user || updating) return;
    const nextStatus = user.isActive === false;
    setUpdating(true);
    const previous = user.isActive;
    setUser((current) => ({ ...current, isActive: nextStatus }));
    try {
      await updateUserStatusApi(user._id || user.id, nextStatus);
      showToast(
        `${user.fullName || "User"} ${nextStatus ? "activated" : "suspended"}.`,
        "success",
      );
      setConfirming(false);
    } catch (requestError) {
      setUser((current) => ({ ...current, isActive: previous }));
      showToast(
        errorMessage(requestError, "Unable to update account status."),
        "error",
      );
    } finally {
      setUpdating(false);
    }
  };
  if (loading)
    return (
      <div
        className="space-y-6"
        aria-busy="true"
        aria-label="Loading user details"
      >
        <Skeleton className="h-8 w-44" />
        <Card>
          <div className="flex gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </Card>
      </div>
    );
  if (error)
    return (
      <ErrorState
        title="Unable to load user"
        message={error}
        onRetry={() => setRetryKey((key) => key + 1)}
      />
    );
  if (!user)
    return (
      <ErrorState
        title="User unavailable"
        message="This user could not be found."
        onRetry={() => setRetryKey((key) => key + 1)}
      />
    );
  const stats = user.stats || {};
  const avatar = user.avatar?.url;
  const initial = safeText(user.fullName, user.username || "U")
    .charAt(0)
    .toUpperCase();
  const unavailable = (
    <p className="muted-copy text-xs">
      This data is not available from the current backend API.
    </p>
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={ROUTES.USERS}
          className="secondary-action inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to users
        </Link>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={() => setRetryKey((key) => key + 1)}
        >
          Refresh
        </Button>
      </div>
      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-theme bg-surface-soft text-2xl font-black text-muted">
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black text-theme">
                {safeText(user.fullName)}
              </h1>
              <p className="muted-copy mt-1 truncate text-sm">
                @{safeText(user.username, "unknown")}
              </p>
              <p className="muted-copy mt-1 truncate text-xs">
                {safeText(user.email)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={user.role || "user"} />
            <StatusBadge
              status={user.isActive === false ? "error" : "success"}
              label={user.isActive === false ? "Suspended" : "Active"}
            />
            <StatusBadge
              status={user.isVerified ? "info" : "warning"}
              label={user.isVerified ? "Verified" : "Unverified"}
            />
            <Button
              variant={user.isActive === false ? "primary" : "danger"}
              size="sm"
              onClick={() => setConfirming(true)}
            >
              {user.isActive === false ? "Activate account" : "Suspend account"}
            </Button>
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Account information" className="lg:col-span-2">
          <dl className="grid gap-5 sm:grid-cols-2">
            <Detail label="Full name" value={safeText(user.fullName)} />
            <Detail
              label="Username"
              value={`@${safeText(user.username, "unknown")}`}
            />
            <Detail label="Email" value={safeText(user.email)} />
            <Detail label="Role" value={safeText(user.role, "user")} />
            <Detail
              label="Email verification"
              value={user.isVerified ? "Verified" : "Not verified"}
            />
            <Detail
              label="Account status"
              value={user.isActive === false ? "Suspended" : "Active"}
            />
            <Detail label="Joined" value={formatDateTime(user.createdAt)} />
            <Detail
              label="Last updated"
              value={formatDateTime(user.updatedAt)}
            />
          </dl>
        </Card>
        <Card title="User statistics">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted">
                <Heart className="h-4 w-4" />
                Favorites
              </span>
              <strong className="text-theme">
                {Number.isFinite(stats.favoriteCount) ? stats.favoriteCount : 0}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted">
                <ListPlus className="h-4 w-4" />
                Wishlist
              </span>
              <strong className="text-theme">
                {Number.isFinite(stats.wishlistCount) ? stats.wishlistCount : 0}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted">
                <MessageSquare className="h-4 w-4" />
                Reviews
              </span>
              <strong className="text-theme">
                {Number.isFinite(stats.reviewCount) ? stats.reviewCount : 0}
              </strong>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Recently added favorites">
          <div className="flex items-center gap-2 text-muted">
            <Heart className="h-4 w-4" />
            {unavailable}
          </div>
        </Card>
        <Card title="Recently added wishlist">
          <div className="flex items-center gap-2 text-muted">
            <ListPlus className="h-4 w-4" />
            {unavailable}
          </div>
        </Card>
        <Card title="Recent reviews">
          <div className="flex items-center gap-2 text-muted">
            <UserRound className="h-4 w-4" />
            {unavailable}
          </div>
        </Card>
      </div>
      <ConfirmDialog
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={updateStatus}
        loading={updating}
        title={user.isActive === false ? "Activate account" : "Suspend account"}
        message={`Are you sure you want to ${user.isActive === false ? "activate" : "suspend"} ${safeText(user.fullName, "this user")}?`}
        confirmText={user.isActive === false ? "Activate" : "Suspend"}
        variant={user.isActive === false ? "primary" : "danger"}
      />
    </div>
  );
};
export default UserDetailsPage;
