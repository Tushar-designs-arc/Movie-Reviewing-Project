import Skeleton from "./common/Skeleton";

const DashboardCard = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  action,
  children,
  loading = false,
  className = "",
}) => {
  return (
    <div
      className={`cinema-panel rounded-2xl p-6 transition-all duration-200 ${className}`}
    >
      {(title || Icon || action) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-theme/60 pb-4">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <Icon
                className="h-5 w-5 text-red-500 shrink-0"
                aria-hidden="true"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-theme">{title}</h2>
                {badge && (
                  <span className="rounded bg-surface-soft border border-theme px-2 py-0.5 text-[10px] font-bold text-muted">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="muted-copy mt-0.5 text-xs">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {loading ? (
        <div className="space-y-3 py-2">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default DashboardCard;
