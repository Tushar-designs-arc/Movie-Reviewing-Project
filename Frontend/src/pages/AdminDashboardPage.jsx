import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clapperboard,
  Film,
  Gauge,
  Heart,
  ListVideo,
  Plus,
  RefreshCw,
  Save,
  Star,
  Tags,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import ContentCard from "../components/ContentCard";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const initialForm = {
  title: "",
  type: "movie",
  genre: "Drama, Thriller",
  releaseYear: new Date().getFullYear(),
  rating: 7.5,
  description: "",
  poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=80",
  banner: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=1800&q=80",
  trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  duration: "45m",
  seasons: 1,
  episodes: 1,
  language: "Hindi",
  maturity: "UA 13+",
  director: "",
  cast: "New Cast",
  tags: "Admin Added",
  isTrending: false,
  isPopular: false,
  isRecentlyAdded: true,
};

const splitList = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const typeLabels = {
  movie: "Movies",
  webseries: "Web Series",
  show: "TV Shows",
  serial: "Serials",
};

const AdminDashboardPage = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [recent, setRecent] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadDashboard = useCallback(
    async ({ quiet = false } = {}) => {
      setLoading(true);
      setLoadError("");

      try {
        const [statsResponse, contentResponse] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/content", { params: { limit: 6, sort: "-createdAt" } }),
        ]);
        setDashboard(statsResponse.data);
        setRecent(contentResponse.data.data || []);
      } catch (error) {
        const message = error.response?.data?.message || "Admin dashboard could not load.";
        setLoadError(message);
        if (!quiet) {
          showToast(message, "error");
        }
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    loadDashboard({ quiet: true });
  }, [loadDashboard]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const createContent = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/content", {
        ...form,
        genre: splitList(form.genre),
        tags: splitList(form.tags),
        cast: splitList(form.cast),
        rating: Number(form.rating) || 0,
        releaseYear: Number(form.releaseYear) || new Date().getFullYear(),
        seasons: Number(form.seasons) || 0,
        episodes: Number(form.episodes) || 1,
      });
      showToast("Content created.", "success");
      setForm(initialForm);
      loadDashboard({ quiet: true });
    } catch (error) {
      showToast(error.response?.data?.message || "Could not create content.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const statCards = [
    { label: "Users", value: dashboard?.stats?.users || 0, icon: Users },
    { label: "Content", value: dashboard?.stats?.content || 0, icon: Film },
    { label: "Watchlist", value: dashboard?.stats?.watchlist || 0, icon: ListVideo },
    { label: "Favorites", value: dashboard?.stats?.favorites || 0, icon: Heart },
  ];

  const typeBreakdown = useMemo(() => dashboard?.byType || [], [dashboard]);
  const totalByType = Math.max(typeBreakdown.reduce((sum, item) => sum + Number(item.total || 0), 0), 1);
  const previewItem = {
    id: "admin-preview",
    title: form.title || "Preview Title",
    type: form.type,
    poster: form.poster,
    releaseYear: form.releaseYear,
    duration: form.duration,
    rating: form.rating,
    genre: splitList(form.genre),
    description: form.description || "Content preview updates as you type.",
  };

  return (
    <div className="section-shell min-h-screen py-28">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[#050609] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.42)] sm:p-8">
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(5,6,9,0.96), rgba(5,6,9,0.78), rgba(5,6,9,0.28)), url(https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80)",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">Content control room</h1>
            <p className="muted-copy mt-3 max-w-2xl text-sm leading-7">
              Signed in as {user?.name || "Admin"} with protected content management access.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadDashboard()}
            className="secondary-action inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </section>

      {loadError ? (
        <div className="cinema-panel mt-6 flex items-start gap-3 rounded-lg p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-400" />
          <div>
            <h2 className="font-black text-white">Admin data unavailable</h2>
            <p className="muted-copy mt-1 text-sm">{loadError}</p>
          </div>
        </div>
      ) : null}

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.label} className="cinema-card rounded-lg p-5">
              <div className="flex items-center justify-between gap-4">
                <Icon className="h-6 w-6 text-red-400" />
                {loading ? <RefreshCw className="h-4 w-4 animate-spin text-neutral-500" /> : null}
              </div>
              <p className="mt-5 text-sm font-black uppercase text-neutral-500">{card.label}</p>
              <p className="mt-1 text-4xl font-black text-white">{card.value}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={createContent} className="cinema-panel rounded-lg p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Create</p>
              <h2 className="mt-1 text-3xl font-black text-white">Add Content</h2>
            </div>
            <span className="inline-flex items-center gap-2 self-start rounded-md border border-white/10 bg-black/[0.28] px-3 py-2 text-xs font-black uppercase text-neutral-300 sm:self-auto">
              <CheckCircle2 className="h-4 w-4 text-red-400" />
              Protected
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <label className="lg:col-span-2">
              <span className="text-sm font-bold text-neutral-300">Title</span>
              <input
                value={form.title}
                onChange={(event) => updateForm("title", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
                required
              />
            </label>

            <label className="lg:col-span-2">
              <span className="text-sm font-bold text-neutral-300">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
                className="cinema-input mt-2 min-h-28 resize-y px-3 py-3 text-sm"
                required
              />
            </label>

            <label>
              <span className="text-sm font-bold text-neutral-300">Poster URL</span>
              <input
                value={form.poster}
                onChange={(event) => updateForm("poster", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
                required
              />
            </label>

            <label>
              <span className="text-sm font-bold text-neutral-300">Banner URL</span>
              <input
                value={form.banner}
                onChange={(event) => updateForm("banner", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
                required
              />
            </label>

            <label>
              <span className="text-sm font-bold text-neutral-300">Trailer URL</span>
              <input
                value={form.trailerUrl}
                onChange={(event) => updateForm("trailerUrl", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-neutral-300">Genres</span>
              <input
                value={form.genre}
                onChange={(event) => updateForm("genre", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-neutral-300">Cast</span>
              <input
                value={form.cast}
                onChange={(event) => updateForm("cast", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-neutral-300">Tags</span>
              <input
                value={form.tags}
                onChange={(event) => updateForm("tags", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
              />
            </label>

            <label>
              <span className="text-sm font-bold text-neutral-300">Director</span>
              <input
                value={form.director}
                onChange={(event) => updateForm("director", event.target.value)}
                className="cinema-input mt-2 px-3 py-3 text-sm"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-4">
              <label>
                <span className="text-sm font-bold text-neutral-300">Type</span>
                <select
                  value={form.type}
                  onChange={(event) => updateForm("type", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                >
                  <option value="movie">Movie</option>
                  <option value="webseries">Web Series</option>
                  <option value="show">TV Show</option>
                  <option value="serial">Serial</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-bold text-neutral-300">Year</span>
                <input
                  type="number"
                  value={form.releaseYear}
                  onChange={(event) => updateForm("releaseYear", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-bold text-neutral-300">Rating</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.rating}
                  onChange={(event) => updateForm("rating", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-bold text-neutral-300">Duration</span>
                <input
                  value={form.duration}
                  onChange={(event) => updateForm("duration", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-4">
              <label>
                <span className="text-sm font-bold text-neutral-300">Language</span>
                <input
                  value={form.language}
                  onChange={(event) => updateForm("language", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-bold text-neutral-300">Maturity</span>
                <input
                  value={form.maturity}
                  onChange={(event) => updateForm("maturity", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-bold text-neutral-300">Seasons</span>
                <input
                  type="number"
                  value={form.seasons}
                  onChange={(event) => updateForm("seasons", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                />
              </label>
              <label>
                <span className="text-sm font-bold text-neutral-300">Episodes</span>
                <input
                  type="number"
                  value={form.episodes}
                  onChange={(event) => updateForm("episodes", event.target.value)}
                  className="cinema-input mt-2 px-3 py-3 text-sm"
                />
              </label>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["isTrending", "Trending", Gauge],
              ["isPopular", "Popular", Star],
              ["isRecentlyAdded", "Recently Added", Tags],
            ].map(([field, label, Icon]) => (
              <label
                key={field}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/[0.24] p-3 text-sm font-bold text-neutral-200"
              >
                <input
                  type="checkbox"
                  checked={Boolean(form[field])}
                  onChange={(event) => updateForm(field, event.target.checked)}
                  className="h-4 w-4 accent-red-600"
                />
                <Icon className="h-4 w-4 text-red-400" />
                {label}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="primary-action mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {submitting ? "Creating..." : "Create Content"}
          </button>
        </form>

        <aside className="space-y-6">
          <div className="cinema-panel rounded-lg p-5">
            <p className="eyebrow">Preview</p>
            <h2 className="mt-1 text-2xl font-black text-white">Card Output</h2>
            <article className="cinema-card mt-5 max-w-[260px] overflow-hidden rounded-lg">
              <div className="relative aspect-[2/3] bg-black">
                <img
                  src={previewItem.poster}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
                <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-black uppercase text-white">
                  {previewItem.type}
                </span>
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-sm font-bold text-white ring-1 ring-white/10">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {previewItem.rating}
                </span>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="line-clamp-1 text-base font-black text-white">
                    {previewItem.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase text-neutral-400">
                    {previewItem.releaseYear} - {previewItem.duration}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {previewItem.genre.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="rounded-md bg-white/[0.08] px-2 py-1 text-xs text-neutral-200 ring-1 ring-white/5"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <div className="cinema-panel rounded-lg p-5">
            <div className="mb-5 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-400" />
              <h2 className="text-2xl font-black text-white">Type Mix</h2>
            </div>
            <div className="space-y-4">
              {typeBreakdown.length ? (
                typeBreakdown.map((item) => {
                  const total = Number(item.total || 0);
                  const width = `${Math.max((total / totalByType) * 100, 6)}%`;

                  return (
                    <div key={item._id}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-bold text-neutral-300">
                          {typeLabels[item._id] || item._id}
                        </span>
                        <span className="text-neutral-500">{total}</span>
                      </div>
                      <div className="h-2 rounded bg-white/10">
                        <div className="h-full rounded bg-red-600" style={{ width }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="muted-copy text-sm">No content breakdown available.</p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="border-l-2 border-red-500 pl-4">
            <p className="eyebrow">Library</p>
            <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">Recently Added</h2>
          </div>
          <Clapperboard className="hidden h-7 w-7 text-red-400 sm:block" />
        </div>

        {recent.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recent.map((item) => (
              <ContentCard key={item.id || item.slug || item._id} item={item} compact />
            ))}
          </div>
        ) : (
          <div className="cinema-panel rounded-lg p-8 text-center">
            <p className="font-black text-white">No recent content found</p>
            <p className="muted-copy mt-2 text-sm">Create a title to populate this shelf.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
