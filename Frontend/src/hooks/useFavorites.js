import { useEffect, useState } from "react";
import { getFavoriteIds, toggleFavoriteId } from "../utils/favorites";

const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const syncFavorites = () => {
      setFavoriteIds(getFavoriteIds());
    };

    syncFavorites();
    window.addEventListener("favorites-updated", syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("favorites-updated", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  const toggleFavorite = (id) => {
    toggleFavoriteId(id);
    setFavoriteIds(getFavoriteIds());
  };

  return {
    favoriteIds,
    isFavorite: (id) => favoriteIds.includes(id),
    toggleFavorite,
  };
};

export default useFavorites;
