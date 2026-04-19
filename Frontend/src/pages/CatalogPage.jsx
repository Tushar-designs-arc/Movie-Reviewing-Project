import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";
import ContentCard from "../components/ContentCard";
import { RailSkeleton } from "../components/Skeletons";
import { genreOptions } from "../utils/content";

const CatalogPage = ({ type, title, subtitle }) => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const params = useMemo(
    () => ({
      type,
      q: query || undefined,
      genre: genre || undefined,
      sort,
      page,
      limit: 12,
    }),
    [type, query, genre, sort, page],
  );

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/content", { params });
        setItems(data.data || []);
        setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [params]);

  return (
    <div className="section-shell min-h-screen py-28">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow">OTT Catalog</p>
          <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">{title}</h1>
          <p className="muted-copy mt-3 max-w-2xl">{subtitle}</p>
        </div>
        <p className="muted-copy text-sm">{pagination.total} titles</p>
      </div>

      <div className="cinema-panel mb-8 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_180px_180px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={`Search ${title.toLowerCase()}`}
            className="cinema-input py-3 pl-10 pr-3 text-sm"
          />
        </label>
        <label className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <select
            value={genre}
            onChange={(event) => {
              setGenre(event.target.value);
              setPage(1);
            }}
            className="cinema-input py-3 pl-10 pr-3 text-sm"
          >
            <option value="">All genres</option>
            {genreOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="cinema-input px-3 py-3 text-sm"
        >
          <option value="-createdAt">Recently Added</option>
          <option value="-rating">Top Rated</option>
          <option value="-releaseYear">Newest Year</option>
          <option value="title">A to Z</option>
        </select>
      </div>

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
          <h2 className="text-2xl font-black text-white">No titles found</h2>
          <p className="muted-copy mt-2">Try another search or genre.</p>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((value) => Math.max(value - 1, 1))}
          className="secondary-action rounded-md px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="muted-copy text-sm">
          Page {pagination.page} of {pagination.pages}
        </span>
        <button
          type="button"
          disabled={page >= pagination.pages}
          onClick={() => setPage((value) => value + 1)}
          className="secondary-action rounded-md px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CatalogPage;
