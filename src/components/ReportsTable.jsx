import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "./common/StatusBadge";
import { ROUTES } from "../constants/routes";
import { formatDate } from "../utils/date";

const text = (value, fallback = "Not available") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);
const idOf = (report) => report.reviewId || report._id || report.id;
const reasons = (report) =>
  Array.isArray(report.reasonSummary) && report.reasonSummary.length
    ? report.reasonSummary
        .map(
          (item) =>
            `${text(item.reason, "Unknown")} (${Number.isFinite(Number(item.count)) ? item.count : 0})`,
        )
        .join(", ")
    : "Not available";
const Actions = ({ report }) => (
  <Link
    to={ROUTES.REPORT_DETAILS(idOf(report))}
    state={{ report }}
    className="icon-action rounded-lg p-2 text-muted hover:text-theme"
    aria-label={`View report for ${text(report.movie?.title, "movie")}`}
  >
    <Eye className="h-4 w-4" aria-hidden="true" />
  </Link>
);

const ReportsTable = ({ reports = [] }) => (
  <div className="space-y-4">
    <div className="hidden overflow-hidden rounded-2xl cinema-panel md:block">
      <div className="overflow-x-auto">
        <table
          className="w-full text-left text-xs"
          aria-label="Reported review queue"
        >
          <thead className="border-b border-theme bg-surface-soft/60 font-bold uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Related review
              </th>
              <th scope="col" className="px-4 py-3.5">
                Reporter reasons
              </th>
              <th scope="col" className="px-4 py-3.5">
                Reported user
              </th>
              <th scope="col" className="px-4 py-3.5">
                Reports
              </th>
              <th scope="col" className="px-4 py-3.5">
                Review status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Latest report
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme/40 font-medium">
            {reports.map((report) => (
              <tr key={idOf(report)} className="hover:bg-surface-soft/30">
                <td className="max-w-xs px-4 py-3">
                  <p className="font-bold text-theme">
                    {text(report.movie?.title)}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {text(report.review)}
                  </p>
                </td>
                <td className="max-w-xs px-4 py-3 text-muted">
                  {reasons(report)}
                </td>
                <td className="px-4 py-3">
                  <p className="text-theme">
                    {text(report.author?.fullName, report.author?.username)}
                  </p>
                  <p className="text-[11px] text-muted">
                    @{text(report.author?.username, "unknown")}
                  </p>
                </td>
                <td className="px-4 py-3 text-theme">
                  {Number.isFinite(Number(report.reportCount))
                    ? report.reportCount
                    : 0}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={report.status || "default"} />
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(report.latestReportAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Actions report={report} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <div
      className="grid gap-4 sm:grid-cols-2 md:hidden"
      aria-label="Reported review cards"
    >
      {reports.map((report) => (
        <article key={idOf(report)} className="rounded-2xl cinema-panel p-4">
          <p className="font-bold text-theme">{text(report.movie?.title)}</p>
          <p className="mt-1 line-clamp-3 text-xs text-muted">
            {text(report.review)}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            <StatusBadge status={report.status || "default"} />
            <StatusBadge
              status="error"
              label={`${Number.isFinite(Number(report.reportCount)) ? report.reportCount : 0} reports`}
            />
          </div>
          <dl className="mt-4 space-y-2 border-t border-theme pt-3 text-xs">
            <div>
              <dt className="text-muted">Reasons</dt>
              <dd className="mt-1 font-bold text-theme">{reasons(report)}</dd>
            </div>
            <div>
              <dt className="text-muted">Latest report</dt>
              <dd className="mt-1 font-bold text-theme">
                {formatDate(report.latestReportAt)}
              </dd>
            </div>
          </dl>
          <div className="mt-3 border-t border-theme pt-3 text-right">
            <Actions report={report} />
          </div>
        </article>
      ))}
    </div>
  </div>
);
export default ReportsTable;
