import { FolderOpen } from "lucide-react";

const EmptyState = ({
  icon: Icon = FolderOpen,
  title = "No data found",
  message = "There are no records to display at this moment.",
  action,
  className = "",
}) => {
  return (
    <div
      className={`cinema-panel flex flex-col items-center justify-center rounded-2xl p-8 text-center ${className}`}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-soft text-muted">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-theme">{title}</h3>
      <p className="muted-copy max-w-sm mt-1 text-xs leading-relaxed">
        {message}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
