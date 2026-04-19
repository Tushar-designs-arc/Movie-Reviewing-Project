import { useCallback, useEffect, useState } from "react";
import api from "../api/client";
import ContentCard from "../components/ContentCard";
import { RailSkeleton } from "../components/Skeletons";

const LibraryPage = ({ collection, title, subtitle }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/user/${collection}`);
      setItems(data.data || []);
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const removeItem = async (contentId) => {
    await api.delete(`/user/${collection}/${contentId}`);
    loadItems();
  };

  return (
    <div className="section-shell min-h-screen py-28">
      <div className="mb-8">
        <p className="eyebrow">My Library</p>
        <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">{title}</h1>
        <p className="muted-copy mt-3 max-w-2xl">{subtitle}</p>
      </div>

      {loading ? (
        <RailSkeleton count={8} />
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((item) => {
            const id = item.content.id || item.content.slug || item.content._id;

            return (
              <div key={item._id || id} className="space-y-2">
                <ContentCard item={item.content} compact />
                <button
                  type="button"
                  onClick={() => removeItem(id)}
                  className="secondary-action w-full rounded-md px-3 py-2 text-sm font-bold transition"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="cinema-panel rounded-lg p-10 text-center">
          <h2 className="text-2xl font-black text-white">Nothing here yet</h2>
          <p className="muted-copy mt-2">Add titles from any content card or detail page.</p>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
