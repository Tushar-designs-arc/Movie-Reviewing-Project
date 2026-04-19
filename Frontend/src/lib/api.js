const configuredOrigin = import.meta.env.VITE_API_ORIGIN?.trim();
const apiOrigin = (configuredOrigin || "http://127.0.0.1:5000").replace(/\/$/, "");

export const getApiUrl = (path = "") => {
  if (!path) {
    return apiOrigin;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${apiOrigin}${path.startsWith("/") ? path : `/${path}`}`;
};

export const fetchJson = async (path, options) => {
  const response = await fetch(getApiUrl(path), options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};
