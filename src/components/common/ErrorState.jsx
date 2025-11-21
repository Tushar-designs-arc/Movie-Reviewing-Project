import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

const ErrorState = ({
  title = "Failed to load data",
  message = "An error occurred while communicating with the server. Please try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`cinema-panel flex flex-col items-center justify-center rounded-2xl p-8 text-center ${className}`}
    >
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/15 text-red-500">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-theme">{title}</h3>
      <p className="muted-copy max-w-sm mt-1 text-xs leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          icon={RefreshCw}
          className="mt-5"
        >
          Retry Request
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
