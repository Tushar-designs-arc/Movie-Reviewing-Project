import { ChevronLeft, ChevronRight, Play, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeroSlider = ({ items = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] || items[0];

  useEffect(() => {
    if (items.length < 2) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % items.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!activeItem) {
    return null;
  }

  const id = activeItem.id || activeItem.slug || activeItem._id;
  const move = (direction) => {
    setActiveIndex((index) => (index + direction + items.length) % items.length);
  };

  return (
    <section className="relative min-h-[610px] overflow-hidden border-b border-white/10 bg-[#050609]">
      <img
        src={activeItem.banner}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050609] via-[#050609]/82 to-[#050609]/22" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[#050609]/18 to-[#050609]/72" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      <div className="section-shell relative z-10 flex min-h-[610px] flex-col justify-end pb-12 pt-32">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Featured now</p>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-md bg-red-600 px-3 py-1 text-xs font-black uppercase text-white">
              {activeItem.type}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.12] px-3 py-1 text-xs font-bold text-white ring-1 ring-white/10">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {activeItem.rating}
            </span>
            <span className="rounded-md bg-white/[0.12] px-3 py-1 text-xs font-bold text-white ring-1 ring-white/10">
              {activeItem.releaseYear}
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
            {activeItem.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-200 sm:text-lg">
            {activeItem.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={`/watch/${id}`}
              className="bright-action inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-black transition"
            >
              <Play className="h-5 w-5 fill-black" />
              Play
            </Link>
            <Link
              to={`/details/${id}`}
              className="secondary-action inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-bold transition"
            >
              <Plus className="h-5 w-5" />
              Details
            </Link>
          </div>
        </div>

        {items.length > 1 ? (
          <div className="mt-10 hidden max-w-5xl grid-cols-4 gap-3 lg:grid">
            {items.slice(0, 4).map((item, index) => (
              <button
                key={item.id || item.slug || item._id || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`group grid grid-cols-[76px_1fr] items-center gap-3 rounded-lg border p-2 text-left transition ${
                  index === activeIndex
                    ? "border-red-500/70 bg-red-600/[0.14]"
                    : "border-white/10 bg-black/35 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <img
                  src={item.poster || item.banner}
                  alt=""
                  className="aspect-[2/3] w-full rounded-md object-cover"
                  loading="lazy"
                />
                <span className="min-w-0">
                  <span className="line-clamp-1 text-sm font-black text-white">{item.title}</span>
                  <span className="mt-1 block text-xs text-neutral-400">{item.releaseYear}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {items.length > 1 ? (
        <>
          <div className="absolute bottom-8 right-4 z-20 flex gap-2 sm:right-8">
            <button
              type="button"
              onClick={() => move(-1)}
              className="icon-action inline-flex h-11 w-11 items-center justify-center rounded-md transition"
              aria-label="Previous hero"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              className="icon-action inline-flex h-11 w-11 items-center justify-center rounded-md transition"
              aria-label="Next hero"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute bottom-8 left-4 z-20 flex gap-2 sm:left-8 lg:hidden">
            {items.map((item, index) => (
              <button
                key={item.id || item.slug || item._id || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition ${
                  index === activeIndex ? "w-9 bg-red-400" : "w-4 bg-white/35 hover:bg-white/60"
                }`}
                aria-label={`Show ${item.title}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
};

export default HeroSlider;
