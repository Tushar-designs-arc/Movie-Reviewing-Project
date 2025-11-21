import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "max-w-lg",
  ariaLabel = "Modal Dialog",
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || ariaLabel}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Dialog Box */}
      <div
        ref={modalRef}
        className={`cinema-panel relative w-full ${maxWidth} rounded-3xl p-6 sm:p-8 shadow-2xl z-10 transition-all duration-200 focus:outline-none`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-theme pb-4 mb-6">
          <div>
            {title && (
              <h2 className="text-xl font-black text-theme">{title}</h2>
            )}
            {subtitle && <p className="muted-copy mt-1 text-xs">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="icon-action rounded-xl p-2 text-muted hover:text-theme transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
