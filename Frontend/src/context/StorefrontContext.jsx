/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { mediaUrl } from "../api/client";

const StorefrontContext = createContext(null);

export const StorefrontProvider = ({ children }) => {
  const [storefront, setStorefront] = useState({
    hero: [],
    trending: [],
    popularWebSeries: [],
    tvShows: [],
    serials: [],
    recentlyAdded: [],
    allContent: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStorefront = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/storefront");
      setStorefront(data);
    } catch (loadError) {
      setError(loadError.response?.data?.message || loadError.message || "Failed to load catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorefront();
  }, []);

  const value = useMemo(() => {
    const allContent = storefront.allContent ?? [];
    const featured = storefront.hero?.[0] ?? allContent[0] ?? null;

    return {
      loading,
      error,
      featured,
      hero: storefront.hero ?? [],
      trending: storefront.trending ?? [],
      popularWebSeries: storefront.popularWebSeries ?? [],
      tvShows: storefront.tvShows ?? [],
      serials: storefront.serials ?? [],
      recentlyAdded: storefront.recentlyAdded ?? [],
      allContent,
      refreshStorefront: loadStorefront,
      getById: (id) => allContent.find((item) => item.id === id || item.slug === id || item._id === id),
      getMediaUrl: mediaUrl,
    };
  }, [storefront, loading, error]);

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
};

export const useStorefront = () => {
  const context = useContext(StorefrontContext);

  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider.");
  }

  return context;
};
