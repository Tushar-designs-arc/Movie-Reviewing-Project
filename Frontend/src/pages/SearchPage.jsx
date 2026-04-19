import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ContentCard from "../components/ContentCard";
import { RailSkeleton } from "../components/Skeletons";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitSearch = (event) => {
    event.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";

    const loadResults = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/content/search", { params: { q, limit: 24 } });
        setItems(data.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [searchParams]);

  return (
    <div className="section-shell min-h-screen py-28">
      <div className="mb-8 max-w-3xl">
        <p className="eyebrow">Search</p>
        <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">Find your next stream</h1>
      </div>

      <form onSubmit={submitSearch} className="cinema-panel mb-8 grid gap-3 rounded-lg p-4 sm:grid-cols-[1fr_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, genre, cast, director"
            className="cinema-input py-3 pl-10 pr-3 text-sm"
          />
        </label>
        <button
          type="submit"
          className="primary-action rounded-md px-6 py-3 text-sm font-black transition"
        >
          Search
        </button>
      </form>

      {loading ? (
        <RailSkeleton count={12} />
      ) : items.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {items.map((item) => (
            <ContentCard key={item.id || item.slug || item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="cinema-panel rounded-lg p-10 text-center">
          <h2 className="text-2xl font-black text-white">No results yet</h2>
          <p className="muted-copy mt-2">Search across movies, shows, serials, and series.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
