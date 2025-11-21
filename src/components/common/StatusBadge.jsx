const StatusBadge = ({ status = "default", label, className = "" }) => {
  const statusStyles = {
    published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    draft: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    open: "bg-red-500/15 text-red-400 border-red-500/30",
    error: "bg-red-500/15 text-red-400 border-red-500/30",
    admin: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    info: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    default: "bg-surface-soft text-muted border-theme",
  };

  const normalizedKey = String(status).toLowerCase();
  const badgeStyle = statusStyles[normalizedKey] || statusStyles.default;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize tracking-wide ${badgeStyle} ${className}`}
    >
      {label || status}
    </span>
  );
};

export default StatusBadge;
