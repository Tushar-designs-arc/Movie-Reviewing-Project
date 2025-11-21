import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MessageSquare,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import usePageMetadata from "../hooks/usePageMetadata";
import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
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

const ReportDetailsPage = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const report = state?.report;
  usePageMetadata({
    title: report?.movie?.title
      ? `Report: ${report.movie.title}`
      : "Report details",
    description: "Inspect MovieVerse report information",
  });
  const reasonSummary =
    Array.isArray(report?.reasonSummary) && report.reasonSummary.length
      ? report.reasonSummary
          .map(
            (item) => `${text(item.reason, "Unknown")} (${count(item.count)})`,
          )
          .join(", ")
      : "Not available";
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={ROUTES.REPORTS}
          className="secondary-action inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to reports
        </Link>
      </div>
      {!report && (
        <Card title="Report data unavailable">
          <p className="muted-copy text-sm">
            The backend does not provide an individual-report endpoint. Return
            to the reports list and open a report again to inspect the available
            data.
          </p>
        </Card>
      )}
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <span className="eyebrow">Reported review</span>
            <h1 className="mt-1 text-2xl font-black text-theme">
              {text(report?.movie?.title, "Report details")}
            </h1>
            <p className="muted-copy mt-1 text-sm">
              Review author:{" "}
              {text(report?.author?.fullName, report?.author?.username)}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={report?.status || "default"} />
            <StatusBadge
              status="error"
              label={`${count(report?.reportCount)} reports`}
            />
          </div>
        </div>
      </Card>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Related review" className="lg:col-span-2">
          <h2 className="text-lg font-black text-theme">
            {text(report?.title, "Untitled review")}
          </h2>
          <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed text-theme">
            {text(report?.review)}
          </p>
        </Card>
        <Card title="Report summary">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted">
                <ShieldAlert className="h-4 w-4" />
                Report count
              </span>
              <strong className="text-theme">
                {count(report?.reportCount)}
              </strong>
            </div>
            <div>
              <p className="text-xs text-muted">Reasons</p>
              <p className="mt-1 text-sm font-bold text-theme">
                {reasonSummary}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <Card title="Available report data">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Report ID" value={text(id)} />
          <Detail label="Related movie" value={text(report?.movie?.title)} />
          <Detail
            label="Reported user"
            value={text(report?.author?.fullName, report?.author?.username)}
          />
          <Detail label="Review status" value={text(report?.status)} />
          <Detail
            label="Latest report"
            value={formatDateTime(report?.latestReportAt)}
          />
          <Detail
            label="Review created"
            value={formatDateTime(report?.createdAt)}
          />
          <Detail label="Updated" value={formatDateTime(report?.updatedAt)} />
          <Detail
            label="Reporter"
            value="Not available from the grouped reports API"
          />
          <Detail
            label="Description"
            value="Not available from the grouped reports API"
          />
          <Detail label="Priority" value="Not available" />
          <Detail label="Resolution notes" value="Not available" />
          <Detail label="Moderator" value="Not available" />
        </dl>
      </Card>
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <div className="flex gap-3">
            <MessageSquare className="h-5 w-5 text-muted" />
            <p className="text-sm text-theme">
              Related review data is shown above.
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex gap-3">
            <UserRound className="h-5 w-5 text-muted" />
            <p className="text-sm text-theme">
              Reporter identities are not returned by this API.
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex gap-3">
            <CalendarDays className="h-5 w-5 text-muted" />
            <p className="text-sm text-theme">
              Latest report: {formatDateTime(report?.latestReportAt)}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default ReportDetailsPage;
