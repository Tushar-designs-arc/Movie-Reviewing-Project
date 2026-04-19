import {
  BookmarkPlus,
  CalendarDays,
  Clock3,
  Heart,
  PlayCircle,
  Star,
  Ticket,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getMovieById, getRelatedMovies } from "../data/movies";
import useFavorites from "../hooks/useFavorites";
import MovieCard from "./MovieCard";

const statCards = (movie) => [
  { label: "Rating", value: movie.rating, icon: Star },
  { label: "Critics", value: `${movie.criticsScore}%`, icon: BookmarkPlus },
  { label: "Runtime", value: movie.runtime, icon: Clock3 },
  { label: "Release", value: movie.releaseDate, icon: CalendarDays },
];

const MovieDetails = () => {
  const { id } = useParams();
  const movie = getMovieById(id);
  const relatedMovies = getRelatedMovies(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!movie) {
    return (
      <div className="section-shell py-28">
        <div className="cinema-panel rounded-lg p-10 text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-2 text-4xl font-black text-white">Movie not found</h1>
          <p className="muted-copy mx-auto mt-4 max-w-2xl text-sm leading-7">
            This detail route is wired up correctly, but the requested movie id does not exist in
            the shared catalog.
          </p>
          <Link
            to="/movies"
            className="primary-action mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-black transition"
          >
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(movie.id);
  const heroQueue = [movie, ...relatedMovies].slice(0, 5);

  return (
    <div className="pb-16 pt-20">
      <section className="relative min-h-[590px] overflow-hidden bg-[#050609]">
        <img
          src={movie.backdrop}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-[0.58]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050609] via-[#050609]/82 to-[#050609]/16" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[#050609]/20 to-[#050609]/72" />

        <div className="section-shell relative z-10 flex min-h-[590px] flex-col justify-end pb-12 pt-20">
          <div className="max-w-4xl">
            <p className="eyebrow mb-4">{movie.status}</p>
            <h1 className="text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
              {movie.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-200 sm:text-lg">
              {movie.overview}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-sm text-neutral-200">
              {[movie.year, movie.certificate, movie.language, `${movie.boxOffice} worldwide`].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-md bg-white/[0.1] px-3 py-1.5 font-bold ring-1 ring-white/10"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {movie.genre.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-black/[0.32] px-3 py-1 text-sm text-neutral-200 ring-1 ring-white/10"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="primary-action inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-black transition"
              >
                <PlayCircle className="h-5 w-5 fill-white" />
                Watch Trailer
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(movie.id)}
                className="secondary-action inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-bold transition"
              >
                <Heart
                  className={`h-5 w-5 ${favorite ? "fill-red-400 text-red-400" : "text-white"}`}
                />
                {favorite ? "Saved" : "Watchlist"}
              </button>
            </div>
          </div>

          <div className="mt-10 hidden max-w-5xl grid-cols-5 gap-3 lg:grid">
            {heroQueue.map((item) => (
              <Link
                key={item.id}
                to={`/movie/${item.id}`}
                className="group grid grid-cols-[64px_1fr] items-center gap-3 rounded-lg border border-white/10 bg-black/35 p-2 transition hover:border-red-500/60 hover:bg-white/[0.06]"
              >
                <img
                  src={item.poster}
                  alt=""
                  className="aspect-[2/3] w-full rounded-md object-cover"
                  loading="lazy"
                />
                <span className="min-w-0">
                  <span className="line-clamp-1 text-sm font-black text-white">{item.title}</span>
                  <span className="mt-1 block text-xs text-neutral-400">{item.year}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="cinema-panel rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="eyebrow">Preview</p>
                <h2 className="mt-1 text-2xl font-black text-white">Inside the movie</h2>
              </div>
              <span className="rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs font-bold uppercase text-neutral-300">
                HD
              </span>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
              <img src={movie.backdrop} alt="" className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
              <button
                type="button"
                className="primary-action absolute left-1/2 top-1/2 inline-flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition"
                aria-label="Play preview"
              >
                <PlayCircle className="h-7 w-7 fill-white" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 rounded bg-white/20">
                  <div className="h-full w-2/5 rounded bg-red-600" />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-neutral-300">
                  <span>01:18</span>
                  <span>{movie.runtime}</span>
                </div>
              </div>
            </div>

            <div className="poster-strip mt-5">
              {heroQueue.map((item) => (
                <Link key={item.id} to={`/movie/${item.id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-white/10 bg-black">
                    <img
                      src={item.poster}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80" />
                    <p className="absolute bottom-2 left-2 right-2 line-clamp-1 text-xs font-black text-white">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="cinema-panel rounded-lg p-5">
              <p className="eyebrow">Details</p>
              <h2 className="mt-1 text-2xl font-black text-white">Movie info</h2>
              <div className="mt-5 grid gap-3">
                {statCards(movie).map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/[0.28] p-3"
                    >
                      <Icon className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-xs font-bold uppercase text-neutral-500">{item.label}</p>
                        <p className="font-black text-white">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cinema-panel rounded-lg p-5">
              <div className="mb-4 flex items-center gap-2">
                <Ticket className="h-5 w-5 text-red-400" />
                <h2 className="text-xl font-black text-white">Where to watch</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.availability.map((platform) => (
                  <span
                    key={platform}
                    className="rounded-md border border-white/10 bg-black/[0.28] px-3 py-2 text-sm font-bold text-white"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="cinema-panel rounded-lg p-6">
          <p className="eyebrow">Story</p>
          <h2 className="mt-1 text-2xl font-black text-white">Editorial verdict</h2>
          <p className="mt-4 text-base leading-8 text-neutral-200">{movie.editorialNote}</p>
          <div className="mt-6">
            <p className="text-sm font-black uppercase text-neutral-500">Cast</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {movie.cast.map((person) => (
                <span
                  key={person}
                  className="rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-neutral-200"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="cinema-panel rounded-lg p-6">
          <p className="eyebrow">Community</p>
          <h2 className="mt-1 text-2xl font-black text-white">Viewer pulse</h2>
          <div className="mt-5 space-y-4">
            {movie.reviews.map((review) => (
              <article key={review.author} className="rounded-lg border border-white/10 bg-black/[0.28] p-4">
                <p className="text-sm leading-7 text-neutral-200">&ldquo;{review.text}&rdquo;</p>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="font-bold text-white">{review.author}</p>
                  <p className="text-sm text-neutral-400">{review.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell mt-10">
        <div className="mb-5 border-l-2 border-red-500 pl-4">
          <h2 className="text-2xl font-black text-white sm:text-3xl">More like this</h2>
          <p className="muted-copy mt-1 text-sm">Compact poster rail inspired by the reference layout.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {relatedMovies.map((relatedMovie, index) => (
            <MovieCard key={relatedMovie.id} movie={relatedMovie} priority={index === 0} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieDetails;
