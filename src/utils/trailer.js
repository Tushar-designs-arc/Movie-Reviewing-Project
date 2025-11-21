const TRUSTED_TRAILER_HOSTS = [
  "youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
  "vimeo.com",
];

export const normalizeTrailerUrl = (value) => String(value || "").trim();

export const isTrustedTrailerUrl = (value) => {
  const normalized = normalizeTrailerUrl(value);
  if (!normalized) return false;

  try {
    const { hostname, protocol } = new URL(normalized);
    return (
      protocol === "https:" &&
      TRUSTED_TRAILER_HOSTS.some(
        (host) => hostname === host || hostname.endsWith(`.${host}`),
      )
    );
  } catch {
    return false;
  }
};
