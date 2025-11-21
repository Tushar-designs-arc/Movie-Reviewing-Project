/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { TOAST_DURATION } from "../constants/ui";

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((items) => [...items, { id, message, type }]);
      window.setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="fixed right-4 top-20 z-[100] grid w-[calc(100%-2rem)] max-w-sm gap-3 focus:outline-none"
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.type] || Info;
          const isError = toast.type === "error";
          const isSuccess = toast.type === "success";

          return (
            <div
              key={toast.id}
              role="alert"
              className="cinema-panel flex items-start gap-3 rounded-lg p-4 text-sm text-theme shadow-2xl transition-all duration-200"
            >
              <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  isError
                    ? "text-red-500"
                    : isSuccess
                      ? "text-emerald-400"
                      : "text-amber-400"
                }`}
              />
              <p className="flex-1 leading-6 font-medium">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-md p-1 text-muted transition hover:bg-surface-soft hover:text-theme"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return context;
};
