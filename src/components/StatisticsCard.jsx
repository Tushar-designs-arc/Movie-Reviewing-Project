import Skeleton from "./common/Skeleton";

const StatisticsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = "text-red-500",
  iconBg = "bg-red-600/15",
  subtitle,
  loading = false,
  className = "",
}) => {
  if (loading) {
    return (
      <div className={`cinema-panel rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="mt-4 h-9 w-20" />
        <Skeleton className="mt-2 h-4 w-36" />
      </div>
    );
  }

  return (
    <div
      className={`cinema-panel rounded-2xl p-6 transition-all duration-200 hover:border-red-500/40 focus-within:ring-2 focus-within:ring-red-500 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">
          {title}
        </span>
        {Icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-black text-theme tracking-tight">
          {value ?? 0}
        </p>
        {subtitle && (
          <div className="mt-1.5 text-xs text-muted leading-snug">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;
