import { Loader2 } from "lucide-react";

const LoadingSpinner = ({
  size = "md",
  label = "Loading...",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-3 text-muted ${className}`}
    >
      <Loader2
        className={`animate-spin text-red-500 ${sizeClasses[size] || sizeClasses.md}`}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
