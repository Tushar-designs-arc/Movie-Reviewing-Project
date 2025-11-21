import { Link } from "react-router-dom";
import { Eye, Loader2 } from "lucide-react";
import StatusBadge from "./common/StatusBadge";
import { ROUTES } from "../constants/routes";
import { formatDate } from "../utils/date";

const text = (value, fallback = "Not available") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);
const initials = (user) =>
  text(user.fullName, user.username || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
const Avatar = ({ user }) => (
  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-theme bg-surface-soft">
    {user.avatar?.url ? (
      <img
        src={user.avatar.url}
        alt=""
        className="h-full w-full object-cover"
      />
    ) : (
      <span
        className="flex h-full w-full items-center justify-center text-xs font-black text-muted"
        aria-hidden="true"
      >
        {initials(user)}
      </span>
    )}
  </div>
);
const UserActions = ({ user, onToggleStatus, updating }) => {
  const id = user._id || user.id;
  const action = user.isActive === false ? "Activate" : "Suspend";
  const name = text(user.fullName, "user");
  return (
    <div
      className="flex items-center justify-end gap-2"
      role="group"
      aria-label={`Actions for ${name}`}
    >
      <Link
        to={ROUTES.USER_DETAILS(id)}
        className="icon-action rounded-lg p-2 text-muted hover:text-theme"
        aria-label={`View ${name}`}
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => onToggleStatus(user)}
        disabled={updating}
        className="secondary-action rounded-lg px-2.5 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`${action} ${name}`}
      >
        {updating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          action
        )}
      </button>
    </div>
  );
};
const UserTable = ({ users = [], onToggleStatus, updatingIds = {} }) => (
  <div className="space-y-4">
    <div className="hidden overflow-hidden rounded-2xl cinema-panel md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Users list">
          <thead className="border-b border-theme bg-surface-soft/60 font-bold uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                User
              </th>
              <th scope="col" className="px-4 py-3.5">
                Role
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5">
                Email
              </th>
              <th scope="col" className="px-4 py-3.5">
                Joined
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme/40 font-medium">
            {users.map((user) => {
              const id = user._id || user.id;
              return (
                <tr
                  key={id}
                  className="transition-colors hover:bg-surface-soft/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} />
                      <div className="min-w-0">
                        <Link
                          to={ROUTES.USER_DETAILS(id)}
                          className="block truncate font-bold text-theme hover:text-red-500"
                        >
                          {text(user.fullName)}
                        </Link>
                        <p className="muted-copy truncate text-[11px]">
                          @{text(user.username, "unknown")}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.role || "user"} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <StatusBadge
                        status={user.isActive === false ? "error" : "success"}
                        label={user.isActive === false ? "Suspended" : "Active"}
                      />
                      <StatusBadge
                        status={user.isVerified ? "info" : "warning"}
                        label={user.isVerified ? "Verified" : "Unverified"}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{text(user.email)}</td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <UserActions
                      user={user}
                      onToggleStatus={onToggleStatus}
                      updating={Boolean(updatingIds[id])}
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
      aria-label="Users cards"
    >
      {users.map((user) => {
        const id = user._id || user.id;
        return (
          <article key={id} className="rounded-2xl cinema-panel p-4">
            <div className="flex gap-3">
              <Avatar user={user} />
              <div className="min-w-0 flex-1">
                <Link
                  to={ROUTES.USER_DETAILS(id)}
                  className="block truncate text-sm font-black text-theme hover:text-red-500"
                >
                  {text(user.fullName)}
                </Link>
                <p className="muted-copy truncate text-xs">
                  @{text(user.username, "unknown")}
                </p>
                <p className="muted-copy mt-1 truncate text-xs">
                  {text(user.email)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              <StatusBadge status={user.role || "user"} />
              <StatusBadge
                status={user.isActive === false ? "error" : "success"}
                label={user.isActive === false ? "Suspended" : "Active"}
              />
              <StatusBadge
                status={user.isVerified ? "info" : "warning"}
                label={user.isVerified ? "Verified" : "Unverified"}
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-theme pt-3">
              <span className="text-[11px] text-muted">
                Joined {formatDate(user.createdAt)}
              </span>
              <UserActions
                user={user}
                onToggleStatus={onToggleStatus}
                updating={Boolean(updatingIds[id])}
              />
            </div>
          </article>
        );
      })}
    </div>
  </div>
);
export default UserTable;
