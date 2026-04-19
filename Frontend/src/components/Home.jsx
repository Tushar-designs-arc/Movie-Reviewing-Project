import { ArrowRight, BookmarkPlus, Clapperboard, Play, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useStorefront } from "../context/StorefrontContext";
import MovieCard from "./MovieCard";

const Home = () => {
  const {
    editorialCollections,
    featuredMovie,
    homeStats,
    loading,
    error,
    movies,
    releaseCalendar,
    streamNote,
  } = useStorefront();

  if (loading) {
    return (
      <div className="section-shell pb-20">
        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
          <h1 className="font-display text-4xl text-white">Loading movies from backend...</h1>
        </section>
      </div>
    );
  }

  if (error || !featuredMovie) {
    return (
      <div className="section-shell pb-20">
        <section className="rounded-[34px] border border-dashed border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
          <h1 className="font-display text-4xl text-white">Backend data not available</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-400">
            {error || "No movie data returned from the backend."}
          </p>
        </section>
      </div>
    );
  }

  const heroRail = movies.slice(1, 4);
  const nowShowing = movies.slice(0, 4);
  const communityNotes = movies.slice(0, 3).map((movie) => ({
    movieTitle: movie.title,
    status: movie.status,
    review: movie.reviews[0],
  }));

  return (
    <div className="pb-20">
      <section className="section-shell pt-8">
        <div
          className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#08111d] px-6 py-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:px-10 sm:py-12"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(8,17,29,0.96) 0%, rgba(8,17,29,0.86) 48%, rgba(8,17,29,0.34) 100%), url(${featuredMovie.backdrop})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,93,82,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.14),transparent_24%)]" />

          <div className="relative grid gap-12 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-3xl">
              <div className="eyebrow mb-5">
                <Sparkles className="h-4 w-4" />
                This week&apos;s marquee pick
              </div>

              <h1 className="font-display text-balance max-w-3xl text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Discover films with a real cinema-magazine feel.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                Cinemate mixes premium discovery, watchlists, fast scorecards, and editorial
                picks so your movie site feels closer to Letterboxd meets a streaming launch page
                than a student demo.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2">
                  {featuredMovie.title}
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2">
                  {featuredMovie.rating} user score
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-4 py-2">
                  {featuredMovie.reviewCount}
                </span>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to={`/movie/${featuredMovie.id}?play=1`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-[#08111d] transition hover:bg-[var(--accent-soft)]"
                >
                  <Play className="h-4 w-4" />
                  Play Featured Movie
                </Link>
                <Link
                  to="/movies"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/10"
                >
                  Browse All Movies
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Now leading</p>
                  <p className="mt-3 font-display text-2xl text-white">{featuredMovie.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{featuredMovie.logline}</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Editorial note</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    {featuredMovie.editorialNote}
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Where to watch</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    {featuredMovie.availability.join(" • ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-white/10 bg-[#07111d]/80 p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                      Tonight&apos;s radar
                    </p>
                    <p className="mt-2 font-display text-2xl text-white">Three more to queue</p>
                  </div>
                  <BookmarkPlus className="h-5 w-5 text-[var(--accent)]" />
                </div>

                <div className="space-y-3">
                  {heroRail.map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      className="flex items-center gap-4 rounded-[22px] border border-white/[0.08] bg-white/[0.04] p-3 transition hover:border-white/15 hover:bg-white/[0.07]"
                    >
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-24 w-[72px] rounded-[18px] object-cover"
                        loading="lazy"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-display text-xl text-white">{movie.title}</p>
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">
                            {movie.rating}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">
                          {movie.genre.slice(0, 2).join(" • ")}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{movie.overview}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {homeStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
                  >
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
                    <p className="mt-3 font-display text-3xl text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow mb-4">
              <Clapperboard className="h-4 w-4" />
              Trending now
            </div>
            <h2 className="font-display text-4xl text-white">Now showing on the homepage</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              A polished storefront starts with bold cards, clear metadata, and genuine browsing
              momentum.
            </p>
          </div>

          <Link
            to="/movies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-soft)]"
          >
            Open full catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {nowShowing.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Star className="h-5 w-5 fill-[#f4c95d] text-[#f4c95d]" />
              <h2 className="font-display text-3xl text-white">Curated shelves</h2>
            </div>

            <div className="space-y-4">
              {editorialCollections.map((collection) => (
                <div
                  key={collection.title}
                  className={`overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r ${collection.accent} p-6`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-xl">
                      <p className="font-display text-2xl text-white">{collection.title}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-200">
                        {collection.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {collection.movieIds.map((movieId) => {
                        const movie = movies.find((item) => item.id === movieId);

                        if (!movie) {
                          return null;
                        }

                        return (
                          <Link
                            key={movie.id}
                            to={`/movie/${movie.id}`}
                            className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-black/35"
                          >
                            {movie.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="mb-6">
              <div className="eyebrow mb-4">Programming calendar</div>
              <h2 className="font-display text-3xl text-white">This week on the platform</h2>
            </div>

            <div className="space-y-4">
              {releaseCalendar.map((item) => (
                <div
                  key={item.title}
                  className="grid grid-cols-[72px_1fr] gap-4 rounded-[24px] border border-white/10 bg-[#07111d]/75 p-4"
                >
                  <div className="rounded-[20px] bg-white/6 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{item.day}</p>
                    <p className="mt-2 font-display text-2xl text-white">{item.date}</p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="mb-8">
          <div className="eyebrow mb-4">Community pulse</div>
          <h2 className="font-display text-4xl text-white">What viewers are saying</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {communityNotes.map((note) => (
            <article
              key={note.movieTitle}
              className="rounded-[30px] border border-white/10 bg-white/[0.04] p-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
                {note.status}
              </p>
              <h3 className="mt-3 font-display text-2xl text-white">{note.movieTitle}</h3>
              <p className="mt-5 text-base leading-8 text-slate-200">&ldquo;{note.review.text}&rdquo;</p>
              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold text-white">{note.review.author}</p>
                <p className="text-sm text-slate-400">{note.review.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-20">
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-r from-[#ff5d52]/15 via-white/[0.03] to-[#2dd4bf]/15 p-8 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow mb-4">Ready to keep going?</div>
              <h2 className="font-display text-4xl text-white sm:text-5xl">
                Turn this into a site people actually want to browse.
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
                The catalog, watchlist flow, discovery rails, and detail pages are all wired to
                feel like a believable movie product from the first click.
              </p>
              {streamNote ? (
                <p className="mt-4 rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-slate-200">
                  {streamNote}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/movies"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-bold text-[#08111d] transition hover:bg-slate-100"
              >
                Explore Catalog
              </Link>
              <Link
                to="/favorites"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/10"
              >
                Open Watchlist
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
