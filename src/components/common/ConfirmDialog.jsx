import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

// Destructive or state-changing actions share one accessible confirmation contract across the admin UI.
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  icon: Icon = AlertTriangle,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      ariaLabel={title}
    >
      <div className="text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/15 text-red-500">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-black text-theme">{title}</h3>
        <p className="muted-copy mt-2 text-xs leading-relaxed max-w-sm mx-auto">
          {message}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            loading={loading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
