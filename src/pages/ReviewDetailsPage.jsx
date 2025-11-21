import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  EyeOff,
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  Star,
  ThumbsUp,
  UserRound,
} from "lucide-react";
import usePageMetadata from "../hooks/usePageMetadata";
import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/common/Button";
import { ROUTES } from "../constants/routes";
import { formatDateTime } from "../utils/date";

const text = (value, fallback = "Not available") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);
const count = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
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

const ReviewDetailsPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const review = state?.review;
  usePageMetadata({
    title: review?.movie?.title
      ? `${review.movie.title} review`
      : "Review details",
    description: "Review reported MovieVerse content",
  });
  const unavailable = !review;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={ROUTES.REVIEWS}
          className="secondary-action inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to reviews
        </Link>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>
      {unavailable && (
        <Card title="Review data unavailable">
          <p className="muted-copy text-sm">
            This backend does not provide a single-review endpoint. Return to
            the reviews list and select the review again to view its available
            moderation data.
          </p>
        </Card>
      )}
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="eyebrow">Reported review</span>
            <h1 className="mt-1 text-2xl font-black text-theme">
              {text(review?.movie?.title, "Review details")}
            </h1>
            <p className="muted-copy mt-1 text-sm">
              by {text(review?.author?.fullName, review?.author?.username)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={review?.status || "default"} />
            <StatusBadge
              status="error"
              label={`${count(review?.reportCount)} reports`}
            />
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Review" className="lg:col-span-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Star className="h-5 w-5 fill-current" aria-hidden="true" />
            <strong>
              {Number.isFinite(Number(review?.rating))
                ? `${review.rating}/5`
                : "Not available"}
            </strong>
          </div>
          <h2 className="mt-5 text-lg font-black text-theme">
            {text(review?.title, "Untitled review")}
          </h2>
          <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-theme">
            {text(review?.review)}
          </p>
        </Card>
        <Card title="Moderation">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted">
                <ThumbsUp className="h-4 w-4" />
                Helpful
              </span>
              <strong className="text-theme">
                {count(review?.helpfulCount)}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted">
                <ShieldAlert className="h-4 w-4" />
                Reports
              </span>
              <strong className="text-theme">
                {count(review?.reportCount)}
              </strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted">
                <EyeOff className="h-4 w-4" />
                Spoilers
              </span>
              <strong className="text-theme">
                {review?.spoilers === true
                  ? "Yes"
                  : review?.spoilers === false
                    ? "No"
                    : "Not available"}
              </strong>
            </div>
          </div>
        </Card>
      </div>
      <Card title="Review information">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Movie" value={text(review?.movie?.title)} />
          <Detail
            label="Reviewer"
            value={text(review?.author?.fullName, review?.author?.username)}
          />
          <Detail label="Created" value={formatDateTime(review?.createdAt)} />
          <Detail label="Updated" value={formatDateTime(review?.updatedAt)} />
          <Detail label="Review status" value={text(review?.status)} />
          <Detail
            label="Latest report"
            value={formatDateTime(review?.latestReportAt)}
          />
          <Detail
            label="Report reasons"
            value={
              Array.isArray(review?.reasonSummary) &&
              review.reasonSummary.length
                ? review.reasonSummary
                    .map(
                      (item) =>
                        `${text(item.reason, "Unknown")} (${count(item.count)})`,
                    )
                    .join(", ")
                : "Not available"
            }
          />
          <Detail label="Review ID" value={text(id)} />
        </dl>
      </Card>
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-muted" />
            <div>
              <p className="text-xs text-muted">Review text</p>
              <p className="font-bold text-theme">
                {review?.review ? "Available" : "Not available"}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <UserRound className="h-5 w-5 text-muted" />
            <div>
              <p className="text-xs text-muted">Reviewer data</p>
              <p className="font-bold text-theme">
                {review?.author ? "Available" : "Not available"}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-muted" />
            <div>
              <p className="text-xs text-muted">Reported</p>
              <p className="font-bold text-theme">
                {formatDateTime(review?.latestReportAt)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default ReviewDetailsPage;
