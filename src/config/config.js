const rawOrigin = import.meta.env.VITE_API_ORIGIN;

if (import.meta.env.PROD && !rawOrigin) {
  throw new Error(
    "VITE_API_ORIGIN environment variable is required in production mode.",
  );
}

const getOrigin = () => {
  let origin = (rawOrigin || "http://localhost:5000").replace(/\/$/, "");
  if (
    typeof window !== "undefined" &&
    window.location?.protocol === "https:" &&
    origin.startsWith("http://")
  ) {
    origin = origin.replace(/^http:\/\//, "https://");
  }
  return origin;
};

export const API_ORIGIN = getOrigin();
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const APP_TITLE = "MovieVerse Admin Panel";
export const API_TIMEOUT = 15000;
