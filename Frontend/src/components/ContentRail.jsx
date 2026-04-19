import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ContentCard from "./ContentCard";
import { RailSkeleton } from "./Skeletons";

const ContentRail = ({ title, subtitle, items = [], to, loading = false }) => {
  if (loading) {
    return (
      <section className="section-shell py-9">
        <div className="mb-5 h-8 w-60 animate-pulse rounded bg-white/10" />
        <RailSkeleton />
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section className="section-shell py-9">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="border-l-2 border-red-500 pl-4">
          <h2 className="text-2xl font-black text-white sm:text-3xl">{title}</h2>
          {subtitle ? <p className="muted-copy mt-1 text-sm">{subtitle}</p> : null}
        </div>
        {to ? (
          <Link
            to={to}
            className="inline-flex items-center gap-2 self-start rounded-md px-1 py-2 text-sm font-bold text-red-300 transition hover:text-white sm:self-auto"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.slice(0, 12).map((item) => (
          <ContentCard key={item.id || item.slug || item._id} item={item} compact />
        ))}
      </div>
    </section>
  );
};

export default ContentRail;
