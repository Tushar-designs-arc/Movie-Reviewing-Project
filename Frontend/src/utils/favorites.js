const STORAGE_KEY = "cinemate-favorites";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const getFavoriteIds = () => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

export const setFavoriteIds = (ids) => {
  if (!canUseStorage()) {
    return;
  }

  const uniqueIds = [...new Set(ids.map((item) => Number(item)))];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueIds));
  window.dispatchEvent(new CustomEvent("favorites-updated"));
};

export const toggleFavoriteId = (id) => {
  const favoriteIds = getFavoriteIds();

  if (favoriteIds.includes(id)) {
    setFavoriteIds(favoriteIds.filter((item) => item !== id));
    return false;
  }

  setFavoriteIds([...favoriteIds, id]);
  return true;
};
