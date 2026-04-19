import { Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useStorefront } from "../context/StorefrontContext";
import useFavorites from "../hooks/useFavorites";
import MovieCard from "./MovieCard";

const Favorites = () => {
  const { movies, loading, error } = useStorefront();
  const { favoriteIds } = useFavorites();
  const favoriteMovies = movies.filter((movie) => favoriteIds.includes(movie.id));
  const averageRating =
    favoriteMovies.length > 0
      ? (
          favoriteMovies.reduce((total, movie) => total + movie.rating, 0) / favoriteMovies.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="section-shell pb-20">
      <section className="overflow-hidden rounded-[34px] border border-white/10 bg-[#08111d] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="eyebrow mb-5">
              <Sparkles className="h-4 w-4" />
              Personal watchlist
            </div>
            <h1 className="font-display text-5xl leading-none text-white sm:text-6xl">
              Your saved movies, organized like a premium queue.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Tap the heart on any card to keep a title here. The state persists in local storage,
              so the experience behaves like a real watchlist.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Saved titles</p>
              <p className="mt-3 font-display text-3xl text-white">{favoriteMovies.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Average score</p>
              <p className="mt-3 font-display text-3xl text-white">{averageRating}</p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="mt-10 rounded-[34px] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
          <h2 className="font-display text-4xl text-white">Loading watchlist data...</h2>
        </section>
      ) : error ? (
        <section className="mt-10 rounded-[34px] border border-dashed border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
          <h2 className="font-display text-4xl text-white">Backend unavailable</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-400">{error}</p>
        </section>
      ) : favoriteMovies.length > 0 ? (
        <section className="mt-10">
          <div className="mb-6 flex items-center gap-3">
            <Heart className="h-5 w-5 fill-[#ff5d52] text-[#ff5d52]" />
            <h2 className="font-display text-3xl text-white">Saved for later</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {favoriteMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-[34px] border border-dashed border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
          <Heart className="mx-auto h-12 w-12 text-slate-500" />
          <h2 className="mt-5 font-display text-4xl text-white">Your watchlist is empty</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-8 text-slate-400">
            Start browsing and hit the heart icon on any movie card. Saved titles will instantly
            appear here and stay available across refreshes.
          </p>
          <Link
            to="/movies"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-bold text-[#08111d] transition hover:bg-[var(--accent-soft)]"
          >
            Explore movies
          </Link>
        </section>
      )}
    </div>
  );
};

export default Favorites;
