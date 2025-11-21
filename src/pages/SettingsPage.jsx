import { MonitorCog, Moon, ShieldCheck, Sun } from "lucide-react";
import usePageMetadata from "../hooks/usePageMetadata";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { THEMES } from "../constants/ui";
import Card from "../components/common/Card";
import StatusBadge from "../components/common/StatusBadge";
import { formatDateTime } from "../utils/date";

const text = (value, fallback = "Not available") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);
const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  usePageMetadata({
    title: "Settings",
    description: "MovieVerse Admin display and account settings",
  });
  return (
    <div className="space-y-6">
      <div className="border-b border-theme pb-6">
        <span className="eyebrow">Preferences</span>
        <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
          System Settings
        </h1>
        <p className="muted-copy mt-1 text-xs">
          Manage the preferences available for this administrator account.
        </p>
      </div>
      <Card title="Display preferences">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-theme">Theme preference</h2>
            <p className="mt-1 text-xs text-muted">
              Saved locally in this browser. Backend preference persistence is
              not available.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === THEMES.LIGHT}
            onClick={toggleTheme}
            className="secondary-action inline-flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-theme"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-soft">
              {theme === THEMES.DARK ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
              )}
            </span>
            {theme === THEMES.DARK ? "Dark theme" : "Light theme"}
          </button>
        </div>
      </Card>
      <Card title="Account">
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted">Current role</dt>
            <dd className="mt-1">
              <StatusBadge status={user?.role || "default"} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Authentication method</dt>
            <dd className="mt-1 font-bold text-theme">Email and password</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Last login</dt>
            <dd className="mt-1 font-bold text-theme">
              {formatDateTime(user?.lastLogin)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Account status</dt>
            <dd className="mt-1">
              <StatusBadge
                status={user?.isActive === false ? "error" : "success"}
                label={user?.isActive === false ? "Suspended" : "Active"}
              />
            </dd>
          </div>
        </dl>
      </Card>
      <Card title="Session information">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
            aria-hidden="true"
          />
          <div>
            <p className="font-bold text-theme">Authenticated session</p>
            <p className="mt-1 text-xs text-muted">
              Session expiry, device details, and sign-in history are not
              available from the current backend.
            </p>
          </div>
        </div>
      </Card>
      <Card title="Notifications">
        <div className="flex items-start gap-3">
          <MonitorCog
            className="mt-0.5 h-5 w-5 shrink-0 text-muted"
            aria-hidden="true"
          />
          <div>
            <p className="font-bold text-theme">Notification preferences</p>
            <p className="mt-1 text-xs text-muted">
              Notification preferences are not supported by the current backend.
            </p>
          </div>
        </div>
      </Card>
      <Card title="Profile">
        <p className="text-sm text-theme">
          Signed in as <strong>{text(user?.fullName, user?.username)}</strong>.
          Profile edits, avatar updates, and password changes are available on
          the Profile page.
        </p>
      </Card>
    </div>
  );
};
export default SettingsPage;
