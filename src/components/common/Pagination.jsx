import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 10,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1 && total <= limit) {
    return null;
  }

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers array with ellipsis handling
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className={`cinema-panel flex flex-col items-center justify-between gap-4 rounded-2xl p-4 sm:flex-row ${className}`}
    >
      <p className="text-xs font-semibold text-muted">
        Showing <span className="font-bold text-theme">{startItem}</span> to{" "}
        <span className="font-bold text-theme">{endItem}</span> of{" "}
        <span className="font-bold text-theme">{total}</span> results
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous Page"
          className="secondary-action inline-flex items-center justify-center rounded-xl p-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((num, idx) => {
          if (num === "...") {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 text-xs text-muted">
                ...
              </span>
            );
          }

          const isActive = num === page;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onPageChange(num)}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition ${
                isActive
                  ? "nav-pill-active text-white"
                  : "secondary-action text-theme hover:bg-surface-soft"
              }`}
            >
              {num}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next Page"
          className="secondary-action inline-flex items-center justify-center rounded-xl p-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
