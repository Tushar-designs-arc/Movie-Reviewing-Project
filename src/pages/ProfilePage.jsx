import { useEffect, useRef, useState } from "react";
import { Camera, KeyRound, RefreshCw, UserRound } from "lucide-react";
import { changePasswordApi, uploadAvatarApi } from "../api/auth";
import {
  createImagePreview,
  getAvatarUrl,
  validateImageFile,
} from "../utils/image";
import { createAbortController } from "../utils/createAbortController";
import usePageMetadata from "../hooks/usePageMetadata";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import ErrorState from "../components/common/ErrorState";
import Skeleton from "../components/common/Skeleton";
import StatusBadge from "../components/common/StatusBadge";
import { formatDateTime } from "../utils/date";

const text = (value, fallback = "Not available") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);

const ProfilePage = () => {
  const { user, loading, refreshUser, updateProfile } = useAuth();
  const { showToast } = useToast();
  const inputRef = useRef(null);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  usePageMetadata({
    title: "Admin Profile",
    description: "Manage your MovieVerse admin profile",
  });
  useEffect(
    () => () => {
      if (file && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [file, preview],
  );
  const retry = async () => {
    setError(null);
    const { signal, controller } = createAbortController();
    try {
      await refreshUser(signal);
    } catch (requestError) {
      setError(requestError?.message || "Unable to load profile.");
    } finally {
      controller.abort();
    }
  };
  const saveProfile = async (event) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await updateProfile({
        fullName: form.fullName ?? user.fullName ?? "",
        username: form.username ?? user.username ?? "",
        bio: form.bio ?? user.bio ?? "",
      });
      showToast("Profile updated.", "success");
    } catch (requestError) {
      showToast(
        requestError?.response?.data?.message || "Unable to update profile.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };
  const selectAvatar = (event) => {
    const selected = event.target.files?.[0];
    const validation = validateImageFile(selected);
    if (validation) {
      showToast(validation, "error");
      return;
    }
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(createImagePreview(selected));
  };
  const saveAvatar = async () => {
    if (!file || uploading) return;
    setUploading(true);
    try {
      await uploadAvatarApi(file);
      await refreshUser();
      setFile(null);
      showToast("Avatar updated.", "success");
    } catch (requestError) {
      showToast(
        requestError?.response?.data?.message || "Unable to upload avatar.",
        "error",
      );
    } finally {
      setUploading(false);
    }
  };
  const updatePassword = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New password and confirmation must match.");
      return;
    }
    setPasswordError("");
    setChangingPassword(true);
    try {
      await changePasswordApi({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("Password changed.", "success");
    } catch (requestError) {
      showToast(
        requestError?.response?.data?.message || "Unable to change password.",
        "error",
      );
    } finally {
      setChangingPassword(false);
    }
  };
  if (loading && !user)
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading profile">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  if (!user)
    return (
      <ErrorState
        title="Profile unavailable"
        message={error || "Unable to load your profile."}
        onRetry={retry}
      />
    );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-theme pb-6">
        <div>
          <span className="eyebrow">Account</span>
          <h1 className="mt-1 text-2xl font-black text-theme sm:text-3xl">
            Admin Profile
          </h1>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={retry}>
          Refresh
        </Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Profile photo">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-theme bg-surface-soft text-3xl font-black text-muted">
              {preview || getAvatarUrl(user) ? (
                <img
                  src={preview || getAvatarUrl(user)}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound aria-hidden="true" />
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={selectAvatar}
            />
            <Button
              variant="secondary"
              size="sm"
              icon={Camera}
              onClick={() => inputRef.current?.click()}
            >
              Choose image
            </Button>
            {file && (
              <Button size="sm" loading={uploading} onClick={saveAvatar}>
                Upload avatar
              </Button>
            )}
            <p className="text-center text-xs text-muted">
              JPG, PNG or WEBP up to 10 MB.
            </p>
          </div>
        </Card>
        <Card title="Account summary" className="lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={user.role || "default"} />
            <StatusBadge
              status={user.isActive === false ? "error" : "success"}
              label={user.isActive === false ? "Suspended" : "Active"}
            />
          </div>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">Email</dt>
              <dd className="mt-1 font-bold text-theme">{text(user.email)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Joined</dt>
              <dd className="mt-1 font-bold text-theme">
                {formatDateTime(user.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Last updated</dt>
              <dd className="mt-1 font-bold text-theme">
                {formatDateTime(user.updatedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Last login</dt>
              <dd className="mt-1 font-bold text-theme">
                {formatDateTime(user.lastLogin)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
      <Card title="Profile information">
        <form onSubmit={saveProfile} className="grid gap-5 sm:grid-cols-2">
          <label className="text-xs font-bold text-muted">
            Full name
            <input
              required
              value={form.fullName ?? user.fullName ?? ""}
              onChange={(event) =>
                setForm({ ...form, fullName: event.target.value })
              }
              className="cinema-input mt-1 px-3 py-2"
            />
          </label>
          <label className="text-xs font-bold text-muted">
            Username
            <input
              required
              value={form.username ?? user.username ?? ""}
              onChange={(event) =>
                setForm({ ...form, username: event.target.value })
              }
              className="cinema-input mt-1 px-3 py-2"
            />
          </label>
          <label className="text-xs font-bold text-muted sm:col-span-2">
            Bio
            <textarea
              value={form.bio ?? user.bio ?? ""}
              maxLength="300"
              onChange={(event) =>
                setForm({ ...form, bio: event.target.value })
              }
              className="cinema-input mt-1 min-h-28 px-3 py-2"
            />
            <span className="mt-1 block text-right text-[11px] text-muted">
              {(form.bio ?? user.bio ?? "").length}/300
            </span>
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" loading={saving}>
              Save profile
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setForm({})}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
      <Card title="Password management">
        <form onSubmit={updatePassword} className="grid gap-5 sm:grid-cols-3">
          <label className="text-xs font-bold text-muted">
            Current password
            <input
              required
              type="password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords({
                  ...passwords,
                  currentPassword: event.target.value,
                })
              }
              className="cinema-input mt-1 px-3 py-2"
            />
          </label>
          <label className="text-xs font-bold text-muted">
            New password
            <input
              required
              minLength="8"
              type="password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, newPassword: event.target.value })
              }
              className="cinema-input mt-1 px-3 py-2"
            />
          </label>
          <label className="text-xs font-bold text-muted">
            Confirm new password
            <input
              required
              minLength="8"
              type="password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={(event) =>
                setPasswords({
                  ...passwords,
                  confirmPassword: event.target.value,
                })
              }
              className="cinema-input mt-1 px-3 py-2"
            />
          </label>
          {passwordError && (
            <p role="alert" className="text-xs text-red-400 sm:col-span-3">
              {passwordError}
            </p>
          )}
          <div className="sm:col-span-3">
            <Button type="submit" loading={changingPassword} icon={KeyRound}>
              Change password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
export default ProfilePage;
