import { Eye, EyeOff, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "./common/StatusBadge";
import { ROUTES } from "../constants/routes";
import { formatDate } from "../utils/date";

const text = (value, fallback = "Not available") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);
const idOf = (review) => review.reviewId || review._id || review.id;

const Actions = ({ review, onAction, pending }) => {
  const id = idOf(review);
  const hidden = review.status === "hidden";
  const title = text(review.movie?.title, "movie");
  return (
    <div
      className="flex justify-end gap-1"
      role="group"
      aria-label={`Actions for review of ${title}`}
    >
      <Link
        to={ROUTES.REVIEW_DETAILS(id)}
        state={{ review }}
        className="icon-action rounded-lg p-2 text-muted hover:text-theme"
        aria-label={`View review of ${title}`}
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => onAction(hidden ? "restore" : "hide", review)}
        disabled={pending}
        className="icon-action rounded-lg p-2 text-muted hover:text-theme disabled:opacity-50"
        aria-label={`${hidden ? "Restore" : "Hide"} review of ${title}`}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : hidden ? (
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onAction("delete", review)}
        disabled={pending}
        className="icon-action rounded-lg p-2 text-red-400 hover:text-red-300 disabled:opacity-50"
        aria-label={`Delete review of ${title}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

const ReviewSummary = ({ review }) => (
  <>
    <p className="font-bold text-theme">{text(review.movie?.title)}</p>
    <p className="mt-1 line-clamp-2 text-xs text-muted">
      {text(review.review)}
    </p>
  </>
);

const ReviewTable = ({ reviews = [], onAction, pendingIds = {} }) => (
  <div className="space-y-4">
    <div className="hidden overflow-hidden rounded-2xl cinema-panel md:block">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-xs"
          aria-label="Reported reviews"
        >
          <thead className="border-b border-theme bg-surface-soft/60 font-bold uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Movie & review
              </th>
              <th scope="col" className="px-4 py-3.5">
                Reviewer
              </th>
              <th scope="col" className="px-4 py-3.5">
                Rating
              </th>
              <th scope="col" className="px-4 py-3.5">
                Reports
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Created
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme/40 font-medium">
            {reviews.map((review) => {
              const id = idOf(review);
              return (
                <tr key={id} className="hover:bg-surface-soft/30">
                  <td className="max-w-xs px-4 py-3">
                    <ReviewSummary review={review} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-theme">
                      {text(review.author?.fullName, review.author?.username)}
                    </p>
                    <p className="text-[11px] text-muted">
                      @{text(review.author?.username, "unknown")}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-theme">
                    {Number.isFinite(Number(review.rating))
                      ? `${review.rating}/5`
                      : "Not available"}
                  </td>
                  <td className="px-4 py-3 text-theme">
                    {Number.isFinite(Number(review.reportCount))
                      ? review.reportCount
                      : 0}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={review.status || "default"} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Actions
                      review={review}
                      onAction={onAction}
                      pending={Boolean(pendingIds[id])}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    <div
      className="grid gap-4 sm:grid-cols-2 md:hidden"
      aria-label="Reported review cards"
    >
      {reviews.map((review) => {
        const id = idOf(review);
        return (
          <article key={id} className="rounded-2xl cinema-panel p-4">
            <ReviewSummary review={review} />
            <div className="mt-3 flex flex-wrap gap-1">
              <StatusBadge status={review.status || "default"} />
              <StatusBadge
                status="error"
                label={`${Number.isFinite(Number(review.reportCount)) ? review.reportCount : 0} reports`}
              />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-theme pt-3 text-xs">
              <div>
                <dt className="text-muted">Reviewer</dt>
                <dd className="mt-1 font-bold text-theme">
                  {text(review.author?.fullName, review.author?.username)}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Rating</dt>
                <dd className="mt-1 font-bold text-theme">
                  {Number.isFinite(Number(review.rating))
                    ? `${review.rating}/5`
                    : "Not available"}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Created</dt>
                <dd className="mt-1 font-bold text-theme">
                  {formatDate(review.createdAt)}
                </dd>
              </div>
            </dl>
            <div className="mt-3 border-t border-theme pt-3">
              <Actions
                review={review}
                onAction={onAction}
                pending={Boolean(pendingIds[id])}
              />
            </div>
          </article>
        );
      })}
    </div>
  </div>
);
export default ReviewTable;
